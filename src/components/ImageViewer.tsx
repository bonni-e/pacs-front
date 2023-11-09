import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ISeriesProps } from "./SeriesViewer";
import { IStudyProps } from "./StudyList";
import DicomImage from "./DicomImage";

interface IImageSummaryProps {
    "studykey": number;
    "pbirthdatetime": string;
    "imagekey": number;
    "pixelrows": number;
    "pixelcolumns": number;
    "seriesinsuid": string;
    "seriesnum": number;
    "seriesdate": string;
    "seriestime": string;
    "manufacturer": string;
    "manumodelname": string;
    "operatorsname": null,
    "pid": string;
    "pname": string;
    "window": number;
    "lev": number;
}

interface IImageViewerProps {
    "study": IStudyProps;
    "series": ISeriesProps;
}

export default function ImageViewer({ study, series }: IImageViewerProps) {
    const [summary, setSummary] = useState<IImageSummaryProps>();
    const fetchSummay = async () => {
        try {
            const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/images/${series.seriesinsuid}`, { method: "POST" });
            const json = await response.json();
            setSummary(json);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchSummay();
    }, []);

    return (
        <>
            <Stack overflow={"hidden"} h={'100%'} position={"relative"} alignItems={"center"} justifyContent={"center"} >
                <DicomImage seriesinsuid={series.seriesinsuid} />
                <Box w={'100%'} h={'100%'} position={"absolute"} pointerEvents={"none"}>
                    <Stack h={'100%'} justifyContent={"space-between"} >
                        <HStack justifyContent={"space-between"} alignItems={"flex-start"}>
                            <Box>
                                <Text>{study.pid}</Text>
                                <Text>{study.pname}</Text>
                                <Text>{study.pbirthdatetime}</Text>
                                <Text>{series.seriesnum}</Text>
                                <Text>{/* {image.imagekey}<br /> */}</Text>
                                <Text>{series.seriesdate}</Text>
                                <Text>{series.seriestime}</Text>
                            </Box>
                            <Box>
                                <Text textAlign={"right"}>{series.manufacturer}</Text>
                                <Text textAlign={"right"}>{series.manumodelname}</Text>
                            </Box>
                        </HStack>
                        <HStack justifyContent={"end"} alignItems={"flex-end"}>
                            <Box>
                                <Text textAlign={"right"}>{summary?.pixelrows}/{summary?.pixelcolumns}</Text>
                                <Text textAlign={"right"}>{summary?.window}/{summary?.lev}</Text>
                                <Text textAlign={"right"}>{series.operatorsname}</Text>
                            </Box>
                        </HStack>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
}