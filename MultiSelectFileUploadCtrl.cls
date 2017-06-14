public with sharing class MultiSelectFileUploadCtrl {
    
    @AuraEnabled
    public static List<MultiFileUploadWrapper> getAllAttachments(Id parentId) {
        System.debug('getAllAttachments called');
        // Attachment permissions are set in parent object (Contact)
        
        if (!Schema.sObjectType.Account.isAccessible()) {
            throw new System.NoAccessException();
            return null;
        }
        List<Attachment> attachmentList = [SELECT Id, Name, LastModifiedDate, ContentType FROM Attachment 
                                           WHERE parentid=:ParentId AND ContentType IN ('image/png', 'image/jpeg', 'image/gif') 
                                           ORDER BY LastModifiedDate DESC ];
        List<MultiFileUploadWrapper> wrapList = new List<MultiFileUploadWrapper>();
        for(Attachment attObj : attachmentList)
        {
            MultiFileUploadWrapper obj = new MultiFileUploadWrapper();
            obj.imageUrl   = '/servlet/servlet.FileDownload?file=' + attObj.Id ;
            obj.attachmentId = attObj.Id ;
            obj.parentId = parentId ;
            obj.attName = attObj.Name ;
            //obj.attcObj = attObj ;
            wrapList.add(obj);
        }
        
        return wrapList ;
        
    }
    
    @AuraEnabled
    public static Attachment saveTheFile(Id parentId, String fileName, String base64Data, String contentType) { 
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment a = new Attachment();
        a.parentId = parentId;
 
        a.Body = EncodingUtil.base64Decode(base64Data);
        a.Name = fileName;
        a.ContentType = contentType;
        
        insert a;
        
        return a;
    }
    
    @AuraEnabled
    public static MultiFileUploadWrapper saveTheChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId) { 
        MultiFileUploadWrapper obj = new MultiFileUploadWrapper();
        Attachment a ;
        if (fileId == '') {
            a = saveTheFile(parentId, fileName, base64Data, contentType);
            fileId = a.Id;
            obj.perUploaded = 0 ;
        } else {
            a = appendToFile(fileId, base64Data);            
        }
              
        obj.imageUrl   = '/servlet/servlet.FileDownload?file=' + fileId ;
        obj.attachmentId = fileId ;
        obj.parentId = parentId ;
        obj.attName = fileName ;
        // obj.attcObj = a ;
        return obj;
    }
    
    private static Attachment appendToFile(Id fileId, String base64Data) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment a = [
            SELECT Id, Body
            FROM Attachment
            WHERE Id = :fileId
        ];
        
     	String existingBody = EncodingUtil.base64Encode(a.Body);
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data); 
        
        update a;
        return a ;
    }
    
    @AuraEnabled
    public static MultiFileUploadWrapper  deleteAttachment(String wrapperObj){
       System.debug('Tets1 '+wrapperObj);
       MultiFileUploadWrapper wrapData = (MultiFileUploadWrapper)System.JSON.deserialize(wrapperObj,MultiFileUploadWrapper.class);
       System.debug('Tets '+wrapData);
       Attachment attToDelete = new Attachment(Id= wrapData.attachmentId);
       delete  attToDelete ;
       return wrapData ;
        
    }
}