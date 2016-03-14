import requests
import json
import sys
import extraction

from watson_developer_cloud import ConceptInsightsV2

'''
By Smruthi
'''

#helper functions

#def authentication(username,password):


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
username = "747f2fe4-fe00-4a41-9e41-c88bbbc47402"
password = "2p6XW559zIYL"
graph_id = id1

concept_insights = ConceptInsightsV2(username='747f2fe4-fe00-4a41-9e41-c88bbbc47402', password='2p6XW559zIYL')

choice = input("choose an option\n 1.Enter a topic 2.Exit :")

# This first request allows you to find out the Concept ID of
# a given query. You need the Concept ID in order to continue processing.
#main outer loop which lets users enter a topic or exit
while choice != 2:
    if choice == 1:
        choice_concept = 0
        query =[]

        #check for invalid topics
        truth = True
        while(truth):
            try:
                concept_chosen = raw_input("Enter your topic of interest:")
                payload = {"query": concept_chosen}
                r = requests.get("https://gateway.watsonplatform.net/concept-insights/api/v2/graphs/wikipedia/en-latest/label_search",
                    auth=(username, password), params=payload)
                checkIfNoConcept = r.json().get('matches')[0]
                truth = False
            except IndexError:
                truth = True
                print "Sorry! Topic doesn't exist! Try again!"

        #append valid topic
        query.append(concept_chosen.encode('UTF-8'))

        #inner loop maintains adding, dleting, replacing, ending journey, starting over
        while choice_concept!=6:

            tracker = 1

            #prints topic
            #for count,x in enumerate(query,1):
                #print count," ",x;

            #appends concept ids of topics
            concept_id = []
            for x in query:
                payload = {"query": x}
                r = requests.get(
                    "https://gateway.watsonplatform.net/concept-insights/api/v2/graphs/wikipedia/en-latest/label_search",
                    auth=(username, password), params=payload)

                # This is an identifier we can use to find other related concepts!
                concept_id.append(r.json().get('matches')[0].get('id'))

            #finds related concepts
            related_concepts = concept_insights.get_related_concepts(concept_ids=concept_id, level=0, limit=3)


            # With this request, we are finding all of the concepts related to the Concept ID we found before.
            # We are limiting the number of results to 3, and are using the most common results ("level = 0").
            payload = {"concepts": concept_id, "limit": "3", "level": "0"}
            r = requests.get("https://gateway.watsonplatform.net/concept-insights/api/v2" + graph_id + "/related_concepts",
                            auth=(username, password), params=payload)

            array_concepts=[]
            map = related_concepts.get("concepts")
            array = []
            for x in map:
                array.append(x.get("concept").get("id"))

            # Turning that array into something that can be read by the Bluemix API.
            # (Again as an array.)"
            string = "["
            for x in array:

                string += "\"" + x + "\", "

            string = string[:-2]
            string += "]"

            #addind one more layer of depth - related topics of related topics
            payload = {"concepts": string, "limit": "3", "level": "0"}
            r = requests.get("https://gateway.watsonplatform.net/concept-insights/api/v2" + graph_id + "/related_concepts",
                            auth=(username, password), params=payload)
            map = r.json().get("concepts")
            print "Related topics are:"
            for x in map:
                source = x.get("concept").get("label")
                source = source.encode('UTF-8')
                print tracker, source
                tracker += 1
                array_concepts.append(x.get("concept").get("label"))
            print "\n"
            choice_concept = input("1.Add a concept to the exisiting topic 2. Replace a topic 3.Delete a topic 4.Finish your search 5.Start over: ")
            #add a topic
            if choice_concept == 1:
                choice_inner_concept = input("1.Choose from the topics 2.Enter a new topic: ")
                if choice_inner_concept == 1:
                    choice_inner_concept -=1
                    concept_chosen = array_concepts[choice_inner_concept]
                    query.append(concept_chosen.encode('UTF-8'))
                    print "concept chosen", concept_chosen.encode('UTF-8')
                elif choice_inner_concept == 2:
                    while(truth):
                        try:
                            concept_chosen = raw_input("Enter your topic of interest:")
                            payload = {"query": concept_chosen}
                            r = requests.get("https://gateway.watsonplatform.net/concept-insights/api/v2/graphs/wikipedia/en-latest/label_search",
                                auth=(username, password), params=payload)
                            checkIfNoConcept = r.json().get('matches')[0]
                            truth = False
                        except IndexError:
                            truth = True
                            print "Sorry! Topic doesn't exist! Try again!"
                    query.append(concept_chosen)

            #replace a topic
            if choice_concept == 2:
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
                        r = requests.get("https://gateway.watsonplatform.net/concept-insights/api/v2/graphs/wikipedia/en-latest/label_search",
                            auth=(username, password), params=payload)
                        checkIfNoConcept = r.json().get('matches')[0]
                        truth = False
                    except IndexError:
                        truth = True
                        print "Sorry! Topic doesn't exist! Try again!"
                query[choice_inner_concept]= concept_chosen

            #delete a topic
            if choice_concept == 3:
                print "Your topic list is:\n"
                for count,x in enumerate(query,1):
                    print count,x
                choice_inner_concept = input("Choose the topic you want to delete")
                choice_inner_concept -= 1
                query.pop(choice_inner_concept)

            #User comes to the end of the search journey
            if choice_concept == 4:
                choice_inner_concept = input("Which topic do you want to know about? Choose from the above list:")
                choice_inner_concept -= 1
                concept_chosen = array_concepts[choice_inner_concept]
                link_primitive = concept_insights.search_concept_by_label(concept_chosen, concept_fields={ "link": 1, "type": 1 })
                link = link_primitive.get("matches")[0].get("link")
                html = requests.get(link).text
                extracted = extraction.Extractor().extract(html.encode('UTF-8'), source_url=link)
                print extracted.description.encode('UTF-8')
                print "To know more click on the link below"
                print link
                break

            #start over
            if choice_concept == 5:
                break

        choice = input("choose an option 1.Enter a concept 2.Exit")



print "Hope you had a nice search journery! Good-Bye!!"
