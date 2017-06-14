public class MultiFileUploadWrapper {
    
    @AuraEnabled
    public string imageUrl;
    @AuraEnabled
    public ID attachmentId;
    @AuraEnabled
    public Id parentId ;
    @AuraEnabled
    public String attName ;
    @AuraEnabled
    public Integer perUploaded ;
    @AuraEnabled
    public Attachment attcObj ;
}