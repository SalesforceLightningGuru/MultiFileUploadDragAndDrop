({
    MAX_FILE_SIZE: 4 500 000, /* 6 000 000 * 3/4 to account for base64 */
    CHUNK_SIZE: 550 000, /* Use a multiple of 4 */
    
    readFile: function(component, helper, file) {
        if (file.size > this.MAX_FILE_SIZE) {
            alert('File size cannot exceed ' + this.MAX_FILE_SIZE + ' bytes.\n' +
                  'Selected file size: ' + file.size);
            return;
        }  
        //var progressBar=document.getElementById("progress-bar");
        
      
        var fr = new FileReader();
        var self = this;
        fr.onload = function() {
            var fileContents = fr.result;
    	    var base64Mark = 'base64,';
            var dataStart = fileContents.indexOf(base64Mark) + base64Mark.length;
 
            fileContents = fileContents.substring(dataStart);
        
    	    self.upload(component, file, fileContents);
        };

        fr.onprogress = function(event) {
            if (event.lengthComputable) {
                var progress = parseInt( ((event.loaded / event.total) * 100), 10 );
               
            }
        };

        fr.onloadend = function(event) {
            
        };
 
        fr.readAsDataURL(file);
       
    },
    
    upload: function(component,file, fileContents) {
        var fromPos = 0;
        var toPos = Math.min(fileContents.length, fromPos + this.CHUNK_SIZE);
        this.uploadChunk(component, file, fileContents, fromPos, toPos, '');   
        
    },
    uploadChunk : function(component, file, fileContents, fromPos, toPos, attachId) {
        var action = component.get("c.saveTheChunk"); 
        var chunk = fileContents.substring(fromPos, toPos);
        
        action.setParams({
            parentId: component.get("v.recordId"),
            fileName: file.name,
            base64Data: encodeURIComponent(chunk), 
            contentType: file.type,
            fileId: attachId
        });
       
        var self = this;
        action.setCallback(this, function(a) {
            
            var state = a.getState(); 
            console.log(JSON.stringify(attachObj));
            if (state === "SUCCESS") { 
                var attachObj = a.getReturnValue();
                fromPos = toPos;
                toPos = Math.min(fileContents.length, fromPos + self.CHUNK_SIZE);    
                if (fromPos < toPos) {
                    self.uploadChunk(component, file, fileContents, fromPos, toPos, attachObj.attachmentId);  
                }else{
                    var filesList = component.get("v.filesList");
                    filesList.push(attachObj);
                    component.set("v.filesList", filesList);
                }
            }
            if (state === "ERROR") {
                var errors = a.getError();
                console.log(errors);
                alert(errors);
                console.log("Error message: " + errors[0].message);
            }
        });
            
       $A.getCallback(function() {
            $A.enqueueAction(action);
       })();
    },         
    intilize: function(component) {
        
        var action = component.get("c.getAllAttachments"); 
        action.setParams({
            parentId: component.get("v.recordId"),
        });
        action.setCallback(this, function(a) {
            var attachments = a.getReturnValue();
            console.log(attachments);        
            component.set('v.filesList', attachments);
        });
        $A.enqueueAction(action);         
    }
    
})