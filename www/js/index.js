/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
     
        var pushNotification = window.plugins.pushNotification;
        
        pushNotification.register(apnSuccessfulRegistration,
                                  apnFailedRegistration, {
                                  "badge": "true",
                                  "sound": "true",
                                  "alert": "true",
                                  "ecb": "onNotificationAPN"
                                  //tell PushPlugin to call onNotificationAPN of global pushCallbacks object
                                  });
        
        
        //alert( 'here' + pushNotification );
        
        
        
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        
        //alert( 'ALIVE!' );
    }
};


function apnSuccessfulRegistration( token )
{
    alert( 'received token' + token );
    
    sendTokenToServer(token)
}

function apnFailedRegistration( error )
{
    //alert( 'Something went wrong' );
     alert("Error: " + error.toString());
}

var server = "http://162.243.206.130:3000";



//make ajax post to the application server toregister device
//registerDevice
function sendTokenToServer(token) {
    
    //alert( 'sending ' + device.platform );
    
    if (window.jQuery) {
        // jQuery is loaded
        alert( 'loaded' );
    } else {
        // jQuery is not loaded
        alert( 'not loaded' );
    }
    
    
    $.ajax( server + "/registerDevice", {
           type: "post",
           dataType: 'json',
           data: JSON.stringify({
                                token: token,
                                platform: 'IOS'
                                }),
           
           success: function(response) {
           
                alert("###Successfully registered device.");
           
                // Add callback
                addCallback('onNotificationAPN', onNotificationAPN);
           },
           error: function ( data )
           {
                alert( "Ajax Call Failed :(");
           }
                       
    });
           
}

var onNotificationAPN = function(event) {
    
    //get promotional text from the application server
    //here we can set a badge manually, or play sounds
    //for more information about PushPlugin, see https://github.com/phonegap-build/PushPlugin
    
    //alert( e );
    
    //alert( event );
    
    if ( event.body )
    {
        alert(event.body);
    }
    
    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }
    
    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
    
};

