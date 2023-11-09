import { IImageProps } from "./DicomImage";
import cornerstone, { init } from '@cornerstonejs/core';
import cornerstoneTools from '@cornerstonejs/tools';
import dicomParser, { ByteArray, ByteStream } from 'dicom-parser';
import { useEffect, useState } from "react";

interface IDicomImageReaderProps {
    "seriesinsuid": string;
    "images": Array<IImageProps>
}

export default function DicomImageReader({ seriesinsuid, images }: IDicomImageReaderProps) {

    init();

    const [data, setData] = useState<Uint8Array>();
    const [imagekey, setImagekey] = useState(1);

    const fetchImageDatas = async () => {
        const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/images/${seriesinsuid}/${imagekey}`, { method: "POST" });

        if (response.ok) {
            const data = await response.arrayBuffer();
            const byteArray = new Uint8Array(data);
            setData(byteArray);

            const index = images.findIndex((image) => image.imagekey === imagekey);
            renderImage(byteArray, images[index].transfersyntaxuid);
        } 
    }

    useEffect(() => {
        fetchImageDatas();
    }, [imagekey]);

    function renderImage(byteArray: ByteArray, transferSyntaxUID: string) {
        // https://github.com/cornerstonejs/dicomParser

        // create a Uint8Array or node.js Buffer with the contents of the DICOM P10 byte stream
        // you want to parse (e.g. XMLHttpRequest to a WADO server)

        // var arrayBuffer = new ArrayBuffer(bufferSize);
        // var byteArray = new Uint8Array(arrayBuffer);

        try {
            // Allow raw files
            const options = { TransferSyntaxUID: transferSyntaxUID };

            // Parse the byte array to get a DataSet object that has the parsed contents
            var dataSet = dicomParser.parseDicom(byteArray, options);

            // access a string element
            var studyInstanceUid = dataSet.string('x0020000d');
            console.log('studyInstanceUid : ', studyInstanceUid);

            // get the pixel data element (contains the offset and length of the data)
            var pixelDataElement = dataSet.elements.x7fe00010;

            // create a typed array on the pixel data (this example assumes 16 bit unsigned data)
            var pixelData = new Uint16Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length / 2);
        }
        catch (ex) {
            console.log('Error parsing byte stream', ex);
        }
    }

    return (
        <>

        </>
    );

}