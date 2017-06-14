({
	deleteContact : function(component, event, helper) {
        var target = event.getSource();  
        var txtVal = target.get("v.value") ;
        
        
		var wrapperObj = component.get("v.AttachmentObject");
        
        
        var action = component.get("c.deleteAttachment");
        action.setParams({
            wrapperObj : JSON.stringify(wrapperObj)
        });
        action.setCallback(this, function(a) {            
            var state = a.getState(); 
            if (state === "SUCCESS") { 
                var attachObj = a.getReturnValue();
                console.log(JSON.stringify(attachObj));
                
                var filesList = component.get("v.filesList");
                for(var i = 0 ; i < filesList.length; i ++)
                {
                    var fileElement = filesList[i];
                    if(fileElement.attachmentId ==attachObj.attachmentId){
                        filesList.splice(i,1);
                        break ;
                    }
                    
                }
                console.log(JSON.stringify(filesList));
                component.set("v.filesList", filesList);
            }
            if (state === "ERROR") {
                var errors = a.getError();
                console.log(JSON.stringify(errors));
                alert('E:'+JSON.stringify(errors));
            }
        });
        $A.enqueueAction(action);  
        
	},
    editContact : function(component, event, helper) {
        var target = event.getSource();  
        var txtVal = target.get("v.value") ;
		alert('Yep we can Edit '+txtVal);
	}

})