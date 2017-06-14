({
    onInit: function(component, event, helper) {
        helper.intilize(component);
    },
    
	onDragOver: function(component, event) {
        event.preventDefault();
    },

    onDrop: function(component, event, helper) {
        debugger ;
		event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        var files = event.dataTransfer.files;
        
        var uoloadeCount = 0 ;
        for (var i = 0; i < files.length; i = i + 1) {
            var file = files[i];  
            helper.readFile(component, helper, file);
            uoloadeCount  = uoloadeCount + 1 ;
        }
        //helper.intilize(component);
        if(uoloadeCount == files.length){
            console.log(" ----- "+uoloadeCount);
        }
        
	},
    handleFilesChange: function(component, event) {
      /*  
       var fileInput = component.find("upButton").getElement();
       var file = fileInput.files[0];
       alert(file.size);
      */ 
    },
})