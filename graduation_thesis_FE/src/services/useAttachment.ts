import { ref, type Ref } from 'vue';
import attachmentApi from '@/apis/attachmentApi';
import enums from '@/constants/enums';

export function useAttachments() {
    const attachments: Ref<any[]> = ref([]);
    const removedAttachments: Ref<any[]> = ref([]);

    const getFileKey = async (refId: number, refType: any) => {
        attachments.value = [];
        removedAttachments.value = [];
        let res = await attachmentApi.getFileKeyByRef(refId, refType);
        if (res && res.status == 200) {
            let fileKeys = res.data;
            fileKeys.forEach((fileKey: any) => {
                getAttachment(fileKey);
            });
        }
    };

    const getAttachment = async (fileName: any) => {
        let res = await attachmentApi.getByKey(fileName);
        if (res && res.status == 200) {
            let fileObj = {
                href: URL.createObjectURL(res.data),
                fileName: fileName,
            };
            attachments.value.push(fileObj);
        }
    };

    const removeFile = (file: any) => {
        attachments.value = attachments.value.filter((el) => el != file);
        removedAttachments.value.push(file);
    };

    const confirmDeleteFile = () => {
        removedAttachments.value.forEach((file) => {
            attachmentApi.deleteFile(file.fileName);
        });
    };

    const addedFiles = ref([]);
    const uploadAFile = async (
        file: any,
        prefix: any,
        refId: any,
        refType: any
    ) => {
        let res = await attachmentApi.uploadFile(file, prefix, refId, refType);
    };
    const uploadAll = async (prefix: any, refId: any, refType: any) => {
        addedFiles.value.forEach((file) => {
            uploadAFile(file, prefix, refId, refType);
        });
    };

    return {
        attachments,
        getFileKey,
        removeFile,
        confirmDeleteFile,
        addedFiles,
        uploadAll,
    };
}
