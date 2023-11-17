import { utilities as csUtils } from "@cornerstonejs/core";

const imagePixelPerImageId = {} as any;
const genderalSeriesPerImageId = {} as any;
const imagePlanePerImageId = {} as any;

function add(imageId: string, metaData: any) {
    const imageURI = csUtils.imageIdToURI(imageId);

    const imageOrientationPatientStr = metaData['x00200037'].split('\\');
    const imagePixel = {
        bitsAllocated: parseInt(metaData['x00280100']),
        bitsStored: parseInt(metaData['x00280101']),
        samplesPerPixel: parseInt(metaData['x00280002']),
        highBit: parseInt(metaData['x00280102']),
        photometricInterpretation: metaData['x00280004'],
        pixelRepresentation: parseInt(metaData['x00280103']),
        modality: metaData['x00080060'],
        seriesInstanceUID: metaData['x0020000E'],
        imageOrientationPatient: imageOrientationPatientStr.map((value: string) => parseInt(value)),
        pixelSpacing: [parseFloat(metaData['x00280030'].split('\\')[0]), parseFloat(metaData['x00280030'].split('\\')[1])],
        frameOfReferenceUID: metaData['x00200052'],
        columns: parseInt(metaData['x00280011']),
        rows: parseInt(metaData['x00280010']),
        voiLut: [],
        VOILUTFunction: ''
    };
    console.log('imagePixel : ', imagePixel);
    imagePixelPerImageId[imageURI] = imagePixel;

    const gerneralSeries = {
        modality: metaData['x00080060'],
        seriesInstanceUID: metaData['x0020000E'],
        seriesNumber: parseInt(metaData['x00200011']),
        studyInstanceUID: metaData['x0020000D'],
        seriesDate: metaData['x00080021'],
        seriesTime: metaData['x00080031'],
    }
    console.log('gerneralSeries : ', gerneralSeries);
    genderalSeriesPerImageId[imageURI] = gerneralSeries;

    const imagePositionPatientStr = metaData['x00200032'].split('\\');
    const pixelSpacingStr = metaData['x00280030'].split('\\');
    const imagePlane = {
        frameOfReferenceUID: metaData['x00200052'],
        rows: parseInt(metaData['x00280010']),
        columns: parseInt(metaData['x00280011']),
        imageOrientationPatient: metaData['x00280037'],
        // rowCosines: metaData['x'],
        // columnCosines: metaData['x'],
        rowCosines: {
            x: 1,
            y: 0,
            z: 0
        },
        columnCosines: {
            x: 0,
            y: 1,
            z: 0
        },
        imagePositionPatient: imagePositionPatientStr.map((value: string) => parseFloat(value)),
        sliceThickness: parseFloat(metaData['x00180050']),
        sliceLocation: parseFloat(metaData['x00201041']),
        pixelSpacing: pixelSpacingStr.map((value: string) => parseFloat(value)),
        rowPixelSpacing: parseFloat(metaData['x00280030'].split('\\')[0]),
        columnPixelSpacing: parseFloat(metaData['x00280030'].split('\\')[1]),
    }
    console.log('imagePlane : ', imagePlane);
    imagePlanePerImageId[imageURI] = imagePlane;

}

function get(type: string, imageId: string) {
    const imageURI = csUtils.imageIdToURI(imageId);

    if (type === 'imagePixelModule') {
        return imagePixelPerImageId[imageURI];
    } else if (type === 'generalSeriesModule') {
        return genderalSeriesPerImageId[imageURI];
    } else if (type === 'imagePlaneModule') {
        return imagePlanePerImageId[imageURI];
    }
}

export { add, get };