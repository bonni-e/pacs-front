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
} from '@chakra-ui/react'
import { IPreviousProps } from './StudyPreviousModal';
import { useEffect, useState } from 'react';
import { IStudyProps, toStringReportStatus } from './StudyList';

export default function StudyPreviousList({pid, pname}:IPreviousProps) {
    // Fetching
    const [isLoading, setIsLoading] = useState(true);
    const [studies, setStudies] = useState([]);
    const fetchStudies = async () => {
        const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/studies/${pid}`);
        const json = await response.json();
        setStudies(json);
        setIsLoading(false);
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
            <TableContainer w={'70%'} padding={'23px'}>
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
                        {studies.map((study:IStudyProps) => (
                            <Tr>
                                <Td>{study.modality}</Td>
                                <Td>{study.studydesc}</Td>
                                <Td>{study.studydate}</Td>
                                <Td>{toStringReportStatus(study.reportstatus)}</Td>
                                <Td>{study.seriescnt}</Td>
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