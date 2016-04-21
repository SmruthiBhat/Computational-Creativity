
import requests
import json
import sys
import time
import extraction
import HTMLParser
import cgi
import copy
import re

from flask import Flask, jsonify
#from BeautifulSoup import BeautifulSoup
from watson_developer_cloud import ConceptInsightsV2

app = Flask(__name__)

# Not used in code, but stored the credentials here so I can look at them later

{
    "credentials": {
        "url": "https://gateway.watsonplatform.net/concept-insights/api",
        "username": "747f2fe4-fe00-4a41-9e41-c88bbbc47402",
        "password": "2p6XW559zIYL"

    }
}

# These are the two graphs supplied by IBM, choose one of them and
# then assign it to "graph_id".
id1 = "/graphs/wikipedia/en-latest"
id2 = "/graphs/wikipedia/en-20120601"
username = "b217c476-c696-462e-b6ff-048e3b36a5f8"
password = "xmXg34vrMSLD"
graph_id = id1
id = "https://gateway.watsonplatform.net/concept-insights/api/v2/graphs/wikipedia/en-latest/label_search"
related_concepts_id= "https://gateway.watsonplatform.net/concept-insights/api/v2" + graph_id + "/related_concepts"
#helper functions

def authentication(username,password):
    return ConceptInsightsV2(username=username, password=password)

def getRequest(id,auth,payload):
    return requests.get(id, auth=auth, params=payload)

def addTopic(query,add_concept):
    choice_inner_concept = input("1.Choose from the topics 2.Enter a new topic: ")
    if choice_inner_concept == 1:
        choice_topic = input("Choose the topic number:")
        choice_topic -=1
        concept_chosen = array_concepts[choice_topic]
        query.append(concept_chosen.encode('UTF-8'))
        print "concept chosen", concept_chosen.encode('UTF-8')
    elif choice_inner_concept == 2:
        truth = True
        while(truth):
            try:
                concept_chosen = raw_input("Enter your topic of interest:")
                payload = {"query": concept_chosen}
                r = getRequest(id,(username,password),payload)
                checkIfNoConcept = r.json().get('matches')[0]
                truth = False
            except IndexError:
                truth = True
                print "Sorry! Topic doesn't exist! Try again!"
        #print "query at the func:", query
        #return query.append(concept_chosen)

def replace(query):
    print "Your topic list is:\n"
    for count,x in enumerate(query,1):
        print count,x
    choice_inner_concept = input("Choose the topic you want to replace")
    choice_inner_concept -=1
    truth = True
    while(truth):
        try:
            concept_chosen = raw_input("Enter the topic with which you want to replace the chosen topic:")
            payload = {"query": concept_chosen}
            r = getRequest(id,(username, password), payload)
            checkIfNoConcept = r.json().get('matches')[0]
            truth = False
        except IndexError:
            truth = True
            print "Sorry! Topic doesn't exist! Try again!"
    query[choice_inner_concept]= concept_chosen
    #return query

def delete(query):
    print "Your topic list is:\n"
    for count,x in enumerate(query,1):
        print count,x
    choice_inner_concept = input("Choose the topic you want to delete")
    choice_inner_concept -= 1
    query.pop(choice_inner_concept)
    #return query
@app.route('/endJourney/<topic>')
def endJourney(topic):
    #choice_inner_concept = input("Which topic do you want to know about? Choose from the above list:")
    #choice_inner_concept -= 1
    #concept_chosen = array_concepts[choice_inner_concept]
    concept_insights = authentication(username,password)
    link_primitive = concept_insights.search_concept_by_label(topic, concept_fields={ "link": 1, "type": 1 })
    link = link_primitive.get("matches")[0].get("link")
    html = requests.get(link).text
    extracted = extraction.Extractor().extract(html.encode('UTF-8'), source_url=link)
    print extracted.description.encode('UTF-8')
    textIntro = extracted.description
    #textIntro.headers['Access-Control-Allow-Origin'] = '*'
    res = jsonify(results=textIntro,links=link)
    res.headers['Access-Control-Allow-Origin'] = '*'
    return res
    #print "To know more click on the link below"
    #print link

def compare(list1,list2):
    print "list1 before",list1
   # print "list2 before",list2
    list_temp =[]
    list_temp=copy.deepcopy(list2)
    print "list_temp before",list_temp
    ln = []
    for i in list2:
        print "checkpoint", i.get("concept").get("label").encode('UTF-8').lower()
        if i.get("concept").get("label").lower() in list1:
            list_temp.remove(i)

    print "list_temp after",list_temp
    for i in range(4):
        ln.append(list_temp[i])
    print "ln",ln
    return ln

'''def HTMLEntitiesToUnicode(text):
    """Converts HTML entities to unicode.  For example '&amp;' becomes '&'."""
    text = unicode(BeautifulSoup(text, convertEntities=BeautifulSoup.ALL_ENTITIES))
    return text

def unicodeToHTMLEntities(text):
    """Converts unicode to HTML entities.  For example '&' becomes '&amp;'."""
    text = cgi.escape(text).encode('ascii', 'xmlcharrefreplace')
    return text'''


@app.route('/search/<query>')
def search(query):

  # 1. custom logic here (eg, send to Concept Insights)
  #children = ['Atlanta', 'Denver', 'SF']
    concept_insights = authentication(username,password)
    #truth = True
    topic = []
    '''try:
        #concept_chosen = raw_input("Enter your topic of interest:")

        print "query",query
        #concept_chosen = query
        payload = {"query": concept_chosen}
        #r = getRequest(id,(username,password),payload)
        checkIfNoConcept = r.json().get('matches')[0]
        #truth = False
    except IndexError:
        #truth = True
        print "Sorry! Topic doesn't exist! Try again!"
        #append valid topic'''
    query = query[:-1]
    topic = query.split("+")
    topic = [x for x in topic if x != ""]
    for count,x in enumerate(topic,0):
        topic[count]=re.sub('[\xa0]', '', x);
    #topic.append(query)
    print "topic",topic
    tracker = 1
    concept_id = []
    #print "query",query
    for x in topic:
        payload = {"query": x.encode('UTF-8')}
        r = getRequest(id,(username,password),payload)
        # This is an identifier we can use to find other related concepts!
        concept_id.append(r.json().get('matches')[0].get('id'))
        #print "concept id",concept_id
        # finds related concepts
    related_concepts = concept_insights.get_related_concepts(concept_ids=concept_id, level=0, limit=7)
    print "related_concepts",related_concepts
    # With this request, we are finding all of the concepts related to the Concept ID we found before.
    # We are limiting the number of results to 3, and are using the most common results ("level = 0").
    # payload = {"concepts": concept_id, "limit": "3", "level": "0"}

    array_concepts=[]
    map = related_concepts.get("concepts")
    topic_temp = []
    for x in topic:
        topic_temp.append(x.lower())
    final_results =  compare(topic_temp,map)
    topic = final_results
    print "map1",map
    array = []
    #for x in map:
        #array.append(x.get("concept").get("id"))

    # Turning that array into something that can be read by the Bluemix API.
    # (Again as an array.)
    '''string = "["
    for x in array:
        string += "\"" + x + "\", "

    string = string[:-2]
    string += "]"'''

    #print "string",string
    #adding one more layer of depth - related topics of related topics
    #payload = {"concepts": string, "limit": "3", "level": "0"}
  #print "payload",payload
  #  ri =  concept_insights.get_related_concepts()
    #r = getRequest(related_concepts_id, (username,password), payload)
    #print "r ",r.json()
    #map = r.json().get("concepts")
    #print "map",map
  #print "time taken", time.clock()-start
    print "Related topics are:"
    for x in final_results:
        source = x.get("concept").get("label")
        source = source.encode('UTF-8')
        print tracker, source
        tracker += 1
        array_concepts.append(source)
    print "\n"
    '''choice_concept = input("1.Add a concept to the exisiting topic 2. Replace a topic 3.Delete a topic 4.Finish your search 5.Start over: ")
  #add a topic
  if choice_concept == 1:
      addTopic(query,array_concepts)

  #replace a topic
  if choice_concept == 2:
      replace(query)

  #delete a topic
  if choice_concept == 3:
      delete(query)

  #User comes to the end of the search journey
  if choice_concept == 4:
      endJourney()'''

    # 2. prepare the response
  
    json_results = final_results

    # 3. format as json
    res = jsonify(results=json_results)
    res.headers['Access-Control-Allow-Origin'] = '*'
    return res

# @app.route('/read/<query>')
# def read(query):

#   # custom logic here (eg, send to Concept Insights)

#   # prepare the response
#   json_results = {
#     'query': query,
#     'cs': 8803
#   }

#   # format as json
#   res = jsonify(results=json_results)
#   res.headers['Access-Control-Allow-Origin'] = '*'
#   return res


if __name__ == "__main__":
  app.run(debug=True)