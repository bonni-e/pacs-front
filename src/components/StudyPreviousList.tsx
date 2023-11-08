import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Stack,
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    Input,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
    Textarea,
    HStack,
} from '@chakra-ui/react'
import { IPreviousProps } from './StudyPreviousModal';
import React, { useEffect, useState } from 'react';
import { IStudyProps, toStringReportStatus } from './StudyList';
import DicomViewerModal from './DicomViewerModal';

export default function StudyPreviousList({ pid, pname }: IPreviousProps) {
    // Fetching
    const [isLoading, setIsLoading] = useState(true);
    const [studies, setStudies] = useState([]);
    const fetchStudies = async () => {
        try {
            const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/studies/${pid}`);
            const json = await response.json();
            setStudies(json);
            setIsLoading(false);
        } catch (error) {
            console.log(error);            
        }
    }
    useEffect(() => {
        fetchStudies();
    }, []);

    return (
        <>
            <Stack padding={'23px 23px 0 23px'} >
                <Text fontSize={'large'}>
                    Previous
                </Text>
                <Text fontSize={'sm'}>
                    환자 아이디 : {pid}
                </Text>
                <Text fontSize={'sm'}>
                    환자 이름 : {pname}
                </Text>
            </Stack>
            <TableContainer w={'100%'} padding={'23px'}>
                <Table variant='striped' colorScheme='blue' fontSize={'sm'} >
                    <Thead bg={'blue.500'}>
                        <Tr>
                            <Th color='white'>검사 장비</Th>
                            <Th color='white'>검사 설명</Th>
                            <Th color='white'>검사 일시</Th>
                            <Th color='white'>판독 상태</Th>
                            <Th color='white'>시리즈</Th>
                            <Th color='white'>이미지</Th>
                            <Th color='white'>Verify</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {studies.map((study: IStudyProps) => (
                            <Tr key={study.studykey}>
                                <Td>{study.modality}</Td>
                                <Td>{study.studydesc}</Td>
                                <Td>{study.studydate}</Td>
                                <Td><ReportButton pid={study.pid} studykey={study.studykey} reportstatus={study.reportstatus} /></Td>
                                <Td>
                                    <HStack>
                                        <Text>
                                            {study.seriescnt}
                                        </Text>
                                        <DicomViewerModal study={study} />
                                    </HStack>
                                </Td>
                                <Td>{study.imagecnt}</Td>
                                <Td>{study.verifyflag}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer >
        </>
    );
}

interface IReportButtonProps {
    'pid': string;
    'studykey': number;
    'reportstatus': number;
}

interface IReportContentProps {
    "conclusion": string;
    "interpretation": string;
    "reportstatus": number;
    "transcriptionist": string;
    "readingdr": string;
    "confirmdr": string;
    "pid": string;
    "pname": string;
    "histno": number;
}

function ReportButton({ pid, studykey, reportstatus }: IReportButtonProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [reports, setReports] = useState(new Array<IReportContentProps>());
    const fetchReports = async () => {
        const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/reports/${pid}/${studykey}`);
        const json = await response.json();
        setReports(json);
        console.log('report :', json);
    }
    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <>
            <Button onClick={onOpen} size={'xs'}>{toStringReportStatus(reportstatus)}</Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size={'lg'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Report</DrawerHeader>

                    <DrawerBody>
                        <Textarea h={'20vh'} placeholder='코멘트' resize={'none'} mb="15px">
                            {reports.length > 0 ? reports[0].conclusion : ''}
                        </Textarea>
                        <Textarea h={'30vh'} defaultValue={reports.length > 0 ? reports[0].interpretation : `[Finding]\n\n\n[Conclusion]\n\n\n[Recommend]\n\n\n`} resize={'none'} mb="15px"></Textarea>
                        <Text color={'blackAlpha.500'} fontSize={'sm'} pl={'3px'}>예비판독의</Text>
                        <Input placeholder='예비판독의' mb="15px" value={reports.length > 0 ? reports[0].transcriptionist : ''} />
                        <Text color={'blackAlpha.500'} fontSize={'sm'} pl={'3px'}>판독의1</Text>
                        <Input placeholder='판독의1' mb="15px" value={reports.length > 0 ? reports[0].readingdr : ''} />
                        <Text color={'blackAlpha.500'} fontSize={'sm'} pl={'3px'}>판독의2</Text>
                        <Input placeholder='판독의2' mb="15px" value={reports.length > 0 ? reports[0].confirmdr : ''} />
                    </DrawerBody>

                    <DrawerFooter gap={2}>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' variant={'outline'}>
                            예비판독
                        </Button>
                        <Button colorScheme='blue'>
                            판독
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}