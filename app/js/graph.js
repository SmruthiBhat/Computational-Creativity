$(document).ready(function () {

			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var renderer, scene, camera, stats;

			var particles,uniforms, plane;

			var PARTICLE_SIZE = 50;

			var raycaster, intersects;
			var mouse, INTERSECTED,SELECTED;
            
            var all_nodes = new THREE.Object3D();
            
            var names = [];
            
            //var new_position = [-320,0,-250];
            var new_position = [0,0,0];
            var new_position = [0,0,0];
            var basic_camera_position = [0,0,250]
            
            
      var Text2D = THREE_Text.Text2D;
      var SpriteText2D = THREE_Text.SpriteText2D;
      var textAlign = THREE_Text.textAlign;
            
            
var data = $("containerGraphs").data("json_data");
//console.log($("container"));



            
			init();
			animate();

			function init() {

				container = document.getElementById( 'containerGraphs' );
                var canvas = document.getElementById('canvas'); 

var camWidth = canvas.clientWidth/4;
var camHeight = canvas.clientHeight/4;
var camFOV = 30;
var camNear = 1; 
var camFar = 1200;
var camOrthonear = 1; 
var camOrthofar = 1000;
                
                
				scene = new THREE.Scene();
                camera = new THREE.CombinedCamera(camWidth,camHeight,camFOV, camNear, camFar,camOrthonear,camOrthofar);
                camera.toOrthographic();
                console.log(camera);
				camera.cameraP = new THREE.PerspectiveCamera( 30, canvas.clientWidth / canvas.clientHeight, 1, 1200 );
                camera.cameraO = new THREE.OrthographicCamera(canvas.clientWidth / - 2, canvas.clientWidth / 2, canvas.clientHeight / 2, canvas.clientHeight / - 2, 1,1000);
                //camera.position.z = 250;
                camera.toPerspective();
				camera.position.z = 480;
                camera.position.y = 200;
                //camera.position.x = -600;

                
                controls = new THREE.TrackballControls( camera );
                //controls = new THREE.OrbitControls( camera );
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;
                
                controls.noRotate = false;
                
				//comment so boundingbox does not show
                scene.add(all_nodes);
                
                addCube();
                
                console.log(controls);

				//
                

renderer = new THREE.WebGLRenderer({canvas: canvas});
canvas.width  = canvas.clientWidth;
canvas.height = canvas.clientHeight;
renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
                
                
				//renderer = new THREE.WebGLRenderer();
				//renderer.setPixelRatio( window.devicePixelRatio );
				//renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//

				raycaster = new THREE.Raycaster();
				mouse = new THREE.Vector2();
                
                var guiParams = {
                    in2D: true,
                    transparent: 0,
                    distance: 100,
                    fov: camera.fov,
                    perspective: true
                };
                
                controls.noRotate = guiParams.in2D;
                
        var myFunctions = {
		    RESET_EVENT : function() {
                controls.reset();
			    //camera.rotation.x = 0;
			    //camera.rotation.y = 0;
			    //camera.rotation.z = 0;
                camera.up.set( 0, 1, 0 );
			    controls.target = new THREE.Vector3(old_position[0],old_position[1],old_position[2]);
                camera.position = new THREE.Vector3(basic_camera_position[0],basic_camera_position[1],basic_camera_position[2]);
                //camera.aspect = 1;
                camera.fov = 30;
                controls.reset();
		    }
	    };
                
                var gui = new dat.GUI({
                    width : 300
                });
                
                camDistance = camera.position.z;
                console.log(gui);
                gui.add(myFunctions, 'RESET_EVENT').name('Reset Position');
                gui.add(guiParams,"in2D",true,false).name('2D').onChange(function(value) {
                    controls.noRotate = guiParams.in2D;
                    if (guiParams.in2D == true) {
                    }
                });
         
                
                gui.add(guiParams,"perspective",true,false).name('perspective').onChange(function(value) {

                    if (guiParams.perspective == true) {
                        camera.toPerspective();
                    }
                    else {
                        camera.toOrthographic();
                    }
                });
                //gui.add(guiParams,'fov',10,90).step(5).name('fov').onChange(function(value) {
                //camera.fov = guiParams.fov;
                //camera.updateProjectionMatrix ();
                //});
                //gui.add(camera.position,'z',10,1000).step(20).name('distance').onChange(function(value) {
                    //});


				//

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '40px';
				container.appendChild( stats.domElement );

				//

                
            renderer.domElement.addEventListener('mousedown', function(event) {
		    if (event.which == 3) {
			    myFunctions.RESET_EVENT();
		    }
	    });
                
				window.addEventListener( 'resize', onWindowResize, false );
                canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
				canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
				canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
                
                document.addEventListener("keydown", onDocumentKeyDown, false);

                
			}

          
                $( "#leftResult" ).on("myCustomEvent",documentSelect);

                
			}

          
          
          
          
          
          function addCube(){
              				//var geometry1 = new THREE.CubeGeometry( 45, 45, 45, 1, 1, 1 );
              //var geometry1 = new THREE.OctahedronGeometry( 45, 0);
                //var geometry1 = new THREE.SphereGeometry( 120, 3, 3, 2, 2, 2 );
                //geometry1.center =new_position;
				//var vertices = geometry1.vertices;
              
              var dist1 = 52;
              var dist2 = 15;
              var vertices = [new THREE.Vector3(dist1,dist2,10),
                                new THREE.Vector3(dist1+dist2*1.22,0,10),
                                new THREE.Vector3(dist1,-dist2,10),
                                new THREE.Vector3(dist1-dist2*1.22,0,10)];

                var numNodes = vertices.length + 1;
				var positions = new Float32Array( numNodes * 3 );
				var colors = new Float32Array( numNodes * 3 );
				var sizes = new Float32Array( numNodes );
                //var names = new Array( numNodes );
                //var names = new Array( vertices.length );

				var vertex;
				var color = new THREE.Color();
                
        sprite1 = new SpriteText2D("", { align: textAlign.center, font: '15px Arial', fillStyle: '#FFFFFF', antialias: true })
        sprite1.position.set(-300, -200, 100)
        //sprite1.position.set(300, 200, -100)
        sprite1.scale.set(.2, .2, .2)
        sprite1.material.alphaTest = 0.1
        sprite1.visible = false;
        scene.add(sprite1);
        
              
        old_position = new_position;
        var vector_old_position = new THREE.Vector3(old_position[0],old_position[1],old_position[2]);
        new_position = [new_position[0]+120,new_position[1],new_position[2]+55];
        var vector_new_position = new THREE.Vector3(new_position[0],new_position[1],new_position[2]);
        //console.log(vector_new_position);     
              
        
        basic_camera_position = [basic_camera_position[0]+120,basic_camera_position[1],basic_camera_position[2]+55]
        camera.position.x += 120;
        camera.position.z += 55;
        //camera.up = new THREE.Vector3(0,1,0);
        //camera.lookAt(vector_new_position);
        //controls.target = vector_new_position;
        if (old_position[0] == 0) {
            controls.target = vector_new_position;
        }
        else {
        controls.target = vector_old_position;  
        }
              

				var material = new THREE.ShaderMaterial( {

					uniforms: {
						color:   { type: "c", value: new THREE.Color( 0xffffff ) },
						texture: { type: "t", value: new THREE.TextureLoader().load( "textures/sprites/ball.png" ) }
					},
					vertexShader: document.getElementById( 'vertexshader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

					alphaTest: 0.9,

				} );
              
            vector_new_position.toArray( positions, 0 );
            sizes[ 0 ] = PARTICLE_SIZE * 1;
            colors[ 0 *3 ] = 0;
            colors[ 0 *3 +1 ] = 0;
            colors[ 0 *3 +2 ] = .8;
            names[ 0 ] = data['results'][0]['concept']['label']; 
              
            var node1 = new THREE.SphereGeometry(PARTICLE_SIZE/10,32,32);
            //var node1 = new THREE.Geometry();
              
            var material1 = new THREE.MeshNormalMaterial();
            material1.opacity = 0;
            material1.transparent = true;
              
              
            //node1.size = PARTICLE_SIZE * 1;
            node1.color = [0,0,.8];
            

            var node2 = new THREE.Mesh(node1,material1);
            //var node2 = new THREE.Points(node1,material); 
            
            node2.position.x = new_position[0];
            node2.position.y = new_position[1];
            node2.position.z = new_position[2];
            node2.name = data['results'][0]['concept']['label'];
            //console.log(node2);
            //node2.visible = false;
            all_nodes.add(node2);
            //scene.add(node2);
            console.log(all_nodes);
              
                        var sprite = new SpriteText2D(data['results'][0]['concept']['label'], { align: textAlign.center, font: '26px Arial', fillStyle: '#FFFFFF', antialias: true });
                        sprite.position.set(new_position[0],new_position[1],new_position[2]+PARTICLE_SIZE/10);
                        //sprite1.position.set(300, 200, -100);
                        sprite.scale.set(.2, .2, .2);
                        sprite.material.alphaTest = 0.1;
                        sprite.visible = true;
                        scene.add(sprite);            
              
              
				for ( var i = 1, l = vertices.length + 1; i < l; i ++ ) {
					//vertex = vertices[ i ]  + new_position[(i%3)];
                    //THREE.Vector3(new_position)
                    
                    if (i <= data.concepts.length-1) {
                    
                    var vertex = new THREE.Vector3();
                    vertex.addVectors(vertices[ i-1 ],vector_new_position);
                    
					vertex.toArray( positions, i * 3 );

					color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
					color.toArray( colors, i * 3 );

					sizes[ i ] = PARTICLE_SIZE * 0.4;
                    //names[ i ] = data['results'][i]['concept']['label'];
                    
                        
                                    var node1 = new THREE.SphereGeometry(PARTICLE_SIZE/6*.4,32,32);


                    node1.color = [0,.8,0];
              
                    
                    var node2 = new THREE.Mesh(node1,material1) 
            
                    node2.position.x = vertex.x;
                    node2.position.y = vertex.y;
                    node2.position.z = vertex.z;
                    node2.name = data['results'][i]['concept']['label'];
                    //node2.visible = false;
                    //console.log(node2);
                    all_nodes.add(node2);
                        
                    
                        var sprite = new SpriteText2D(data['results'][i]['concept']['label'], { align: textAlign.center, font: '20px Arial', fillStyle: '#FFFFFF', antialias: true });
                        sprite.position.set(vertex.x,vertex.y, vertex.z+3);
                        //sprite1.position.set(300, 200, -100);
                        sprite.scale.set(.2, .2, .2);
                        sprite.material.alphaTest = 0.1;
                        sprite.visible = true;
                        scene.add(sprite);
                    }

				}

                
					//vertex = vertices[ vertices.length ];
					//vertex.toArray( positions, (vertices.length) * 3 );

					//color.setHSL( 0.01 + 0.1 * ( vertices.length / vertices.length ), 1.0, 0.5 )
					//color.toArray( colors, vertices.length * 3 );

					//sizes[ vertices.length-1 ] = PARTICLE_SIZE * 1;
                    //colors[ (vertices.length-1) *3 ] = 0;
                    //colors[ (vertices.length-1) *3 +1 ] = 0;
                    //colors[ (vertices.length-1) *3 +2 ] = .8;
                
                
				for ( var i = 1, l = vertices.length + 1; i < l; i ++ ) {

					if (i <= data.concepts.length-1) {
					names.push(data['results'][i]['concept']['label']);
                    }
                    else {
                        names.push('topic');
                    }
				}
                
                //names[ vertices.length-1 ] = data['results'][0]['concept']['label']; 
                
                
				var geometry = new THREE.BufferGeometry();
				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
				geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
                //geometry.addAttribute( 'name', new THREE.BufferAttribute( names, 1 ) );


				//



				//

				particles = new THREE.Points( geometry, material );
                //var temp_geometry = new THREE.Geometry().fromBufferGeometry( geometry );
                //all_particles.merge(geometry);
                //console.log(all_particles);
				scene.add( particles );


              
              
          }
          
          
          

			function onDocumentKeyDown( event ) {
                var char = event.which;

                if (char == 80)
                    {
	                    camera.toPerspective();
                        //camera.type = camera.cameraP.type;
                    }
                if (char == 79)
                    {                
                        camera.toOrthographic();
                        //camera.type = camera.cameraO.type;
                    }
                if (char == 13)
                    {                
                         addCube();
                    }
                   
			}
          
         function documentSelect( event ) {
             //event.preventDefault();
var data = $("#containerGraphs").data("json_data");
             console.log(data);
             addCube(data);
         }
			
          

			function onDocumentKeyDown( event ) {
                var char = event.which;

                if (char == 80)
                    {
	                    camera.toPerspective();
                        //camera.type = camera.cameraP.type;
                    }
                if (char == 79)
                    {                
                        camera.toOrthographic();
                        //camera.type = camera.cameraO.type;
                    }
                if (char == 13)
                    {                
                         addCube();
                    }
                   
			}
          
			//function onDocumentMouseMove( event ) {

				//event.preventDefault();

				//mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				//mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			//}

			function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;

				//

				//raycaster.setFromCamera( mouse, camera );
                castRaySetup();
				if ( SELECTED ) {

					var intersects = raycaster.intersectObject( plane );

					if ( intersects.length > 0 ) {

						SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );

					}

					return;

				}

				var intersects = raycaster.intersectObjects( all_nodes, true );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

						plane.position.copy( INTERSECTED.position );
						plane.lookAt( camera.position );

					}

					container.style.cursor = 'pointer';

				} else {

					//if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

					container.style.cursor = 'auto';
                    
                    sprite1.visible = false;

				}

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				//raycaster.setFromCamera( mouse, camera );
                castRaySetup();
				var intersects = raycaster.intersectObjects( all_nodes, true );

				if ( intersects.length > 0 ) {

					controls.enabled = false;

					SELECTED = intersects[ 0 ].object;

					var intersects = raycaster.intersectObject( plane );

					if ( intersects.length > 0 ) {

						offset.copy( intersects[ 0 ].point ).sub( plane.position );

					}

					container.style.cursor = 'move';

				}
                
                //var new_position = [200,200,30];
                
                
                
                

			}

			function onDocumentMouseUp( event ) {

				event.preventDefault();

				controls.enabled = true;

				if ( INTERSECTED ) {

					plane.position.copy( INTERSECTED.position );

					SELECTED = null;

				}

				container.style.cursor = 'auto';

			}
          
          
          
                    
        function castRaySetup() {

			if ( camera.inPerspectiveMode == true ) {

				raycaster.ray.origin.setFromMatrixPosition( camera.matrixWorld );
				raycaster.ray.direction.set( mouse.x, mouse.y, 0.5 ).unproject( camera ).sub( raycaster.ray.origin ).normalize();

			} else if ( camera.inOrthographicMode == true ) {

				raycaster.ray.origin.set( mouse.x, mouse.y, - 1 ).unproject( camera );
				raycaster.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );

			} else {

				console.error( 'THREE.Raycaster: Unsupported camera type.' );

			}
          
        }
          
            
			function onWindowResize() {

				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( canvas.clientWidth, canvas.clientHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				//particles.rotation.x += 0.0003;
				//particles.rotation.y += 0.0002;

				//var geometry = all_nodes.geometry;
				//var attributes = geometry.attributes;
                
                //raycaster.setFromCamera( mouse, camera );
				castRaySetup();
                //console.log(all_nodes);
				var intersects = raycaster.intersectObject( all_nodes, true );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object.id ) {
						//attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;

						INTERSECTED = intersects[ 0 ].object.id;

						//attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 1.1;
                        //console.log(attributes.size.array[ INTERSECTED ]);
						//attributes.size.needsUpdate = true;
                        //console.log(intersects[ 0 ])
                        //sprite1.position.x = intersects[ 0 ]['point'].x +1 - (intersects[ 0 ]['point'].x - camera.position.x)/40;
                        //sprite1.position.y = intersects[ 0 ]['point'].y +1 - (intersects[ 0 ]['point'].y - camera.position.y)/40;
                        //sprite1.position.z = intersects[ 0 ]['point'].z - (intersects[ 0 ]['point'].z - camera.position.z)/40;
                        
                        sprite1.position.x = controls.target.x + 150;
                        sprite1.position.y = controls.target.y + 80;
                        sprite1.position.z = controls.target.z+30;
                        
                        sprite1.font = '60px Arial';
                        sprite1.fillStyle = '#0000FF';
                        
                        //sprite1.position.set(intersects[ 0 ]['point'].x+10,intersects[ 0 ]['point'].y+10,intersects[ 0 ]['point'].z+10)
                        //console.log(intersects[ 0 ])
                        //sprite1._text = intersects[ 0 ]['object']['name']
                        //console.log(intersects[ 0 ])
                        
                        sprite1.text = names[Number(intersects[ 0 ]['index'])];
                        sprite1.text = intersects[ 0 ].object.name;
                        //console.log(particles);
                        sprite1.visible = true;
                        //sprite1.material.map.needsUpdate = true;
                        
                //particles.rotation.x += 0;
				//particles.rotation.y += 0;

					}

				} else if ( INTERSECTED !== null ) {
					//attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
					//attributes.size.needsUpdate = true;
					INTERSECTED = null;
                    sprite1.visible = false;
                    
                //particles.rotation.x += 0.0005;
				//particles.rotation.y += 0.001;

				}

                controls.update();
				renderer.render( scene, camera );

			}
          
          });
