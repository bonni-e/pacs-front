import { useEffect, useRef, useState } from "react";
import { IDicomImageReaderProps } from "./DicomImageRender";
import { CircularProgress, CircularProgressLabel, Skeleton } from "@chakra-ui/react";
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Viewport from "./Viewport";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

cornerstoneTools.init();

// Preferences
const fontFamily = 'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
cornerstoneTools.toolStyle.setToolWidth(2);
cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

cornerstoneTools.store.state.touchProximity = 40;

// IMAGE LOADER
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
        decodeTask: {
            initializeCodecsOnStartup: false,
            usePDFJS: false,
            strict: false,
        },
    },
});

export default function DicomImageReaderOld({ seriesinsuid, images }: IDicomImageReaderProps) {

    const counting = useRef<NodeJS.Timeout>();
    const [count, setCount] = useState(0);

    const [isReady, setIsReady] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageIds, setImageIds] = useState<(string | null)[]>([]);

    const fetchImage = async (sopinstanceuid: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_MYPACS_SERVER}/v1/api/pacs/images/${seriesinsuid}/${sopinstanceuid}`, { method: 'POST' });
            const buffer = await response.arrayBuffer();
            const imageId = `dicomweb:${await URL.createObjectURL(new Blob([buffer], { type: 'application/dicom' }))}`;
            // console.warn('imageId : ', imageId);

            const transferSyntaxUID = images.filter(image => image.sopinstanceuid === sopinstanceuid).map(image => image.transfersyntaxuid);
            const dataSet = dicomParser.parseDicom(new Uint8Array(buffer), { TransferSyntaxUID: transferSyntaxUID[0] });
            const sttudyTime = dataSet.floatString('x00080030');

            return {
                imageId: imageId,
                studyTime: sttudyTime
            };
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const imageIdPromises = images.map((image) => fetchImage(image.sopinstanceuid));
                const resolvedImageIds = await Promise.all(imageIdPromises.filter(id => id !== null));

                // sort
                resolvedImageIds.sort((a, b) => {
                    const timeA = a?.studyTime ?? 0;
                    const timeB = b?.studyTime ?? 0;
                    return timeA - timeB;
                })

                const list = await Promise.all(resolvedImageIds.map((obj) => obj?.imageId));
                setImageIds([...list] as string[]);
                setIsLoaded(true);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (!isLoaded) {
            fetchData();
        }
    }, [isLoaded]);

    useEffect(() => {
        if (count === 0) {
            counting.current = setInterval(() => {
                setCount(prevCount => (prevCount + 1));
            }, 330);
        }
    }, []);

    useEffect(() => {
        if (count === images.length) {
            clearInterval(counting.current);

            let num = 3;
            let out = setInterval(() => {
                num = num - 1;

                if (num === 0) {
                    clearInterval(out);
                    setIsReady(true);
                }
            }, 330);
        }
    }, [count]);

    return (
        <>
            {/* https://react.dev/learn/conditional-rendering#logical-and-operator- */}
            {!isReady &&
                <CircularProgress
                    isIndeterminate
                    color='blue.400'
                    zIndex={1}
                    position={'absolute'}
                    left={'44vw'}
                    top={'44vh'}
                    size={'100px'}
                    fontSize={'75px'}
                >
                    <CircularProgressLabel>{Math.floor(count / images.length * 100)}%</CircularProgressLabel>
                </CircularProgress>
            }
            <Skeleton
                isLoaded={isReady}
                w={'80vh'}
                h={'80vh'}
                margin={'auto'}
                startColor={'blue.500'}
                endColor={'blue.900'}
            >
                {isLoaded && <Viewport ids={imageIds} />}
            </Skeleton>
        </>
    );
}