import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Checkbox,
    CheckboxGroup,
    Text,
} from '@chakra-ui/react'
import StudyPreviousModal from './StudyPreviousModal';

export interface IStudyProps {
    "aiModuleName": string;
    "pid": string;
    "pname": string;
    "aiScore": number;
    "studykey": number;
    "pbirthdatetime": string;
    "verifyflag": number;
    "patientkey": number;
    "reportstatus": number;
    "modality": string;
    "imagecnt": number;
    "studydate": string;
    "studydesc": string;
    "seriescnt": number;
    "aiCompany": string;
    "aiUpdated": string;
    "aiPriority": number;
    "aiNumberOfFindings": number;
    "aiAbnormalYn": string;
    "aiFindings": string;
    "aiReport": string;
    "aiVersion": string;
    "aiResultCode": string;
}

interface IStudyList {
    "studies": Array<IStudyProps>
}

export default function StudyList({ studies }: IStudyList) {

    const color = [
        "#FF0000",
        "#C0504D",
        "#E46C0A",
        "#FAC090",
        "#FFFF00",
        "#0000FF",
        "#7FFF00",
    ];

    return (
        <>
            <TableContainer padding={'23px'}>
                <Table variant='simple' colorScheme='blue' fontSize={'sm'}>
                    <TableCaption color={'gray.300'}>MyPACS Study list @PACSPLUS-DATABASE</TableCaption>
                    <Thead bg={'blue.500'}>
                        <Tr>
                            <Th color='white'>환자 아이디</Th>
                            <Th color='white'>환자 이름</Th>
                            <Th color='white'>검사 장비</Th>
                            <Th color='white'>검사 설명</Th>
                            <Th color='white' textAlign={'center'}>검사 일시</Th>
                            <Th color='white' textAlign={'center'}>AI Vender</Th>
                            <Th color='white' textAlign={'center'}>위험 지수</Th>
                            <Th color='white' textAlign={'center'}>판독 상태</Th>
                            <Th color='white' textAlign={'center'}>시리즈</Th>
                            <Th color='white' textAlign={'center'}>이미지</Th>
                            <Th color='white' textAlign={'center'}>Verify</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <CheckboxGroup>
                            {studies.map((study: IStudyProps) => (
                                <Tr key={study.studykey} _hover={{ backgroundColor: 'RGBA(0,0,0,0.1)' }}>
                                    <Td><Checkbox value={(study.studykey).toString()} />{study.pid}</Td>
                                    <Td><StudyPreviousModal pid={study.pid} pname={study.pname} /></Td>
                                    <Td>{study.modality}</Td>
                                    <Td>{study.studydesc}</Td>
                                    <Td textAlign={'center'}>{study.studydate}</Td>
                                    <Td textAlign={'center'}>{study.aiCompany}</Td>
                                    <Td>
                                        <Text
                                            textAlign={'center'}
                                            backgroundColor=
                                            {study.aiPriority !== null ? color[study.aiPriority - 1] : (study.aiScore === 100 ? color[1] : color[Math.ceil(10 - study.aiScore / 10) - 1])}
                                            color={study.aiScore >= 80 ? 'white' : 'black'}
                                        >
                                            {study.aiScore === null ? 0 : study.aiScore}
                                        </Text>
                                    </Td>
                                    <Td textAlign={'center'}>{toStringReportStatus(study.reportstatus)}</Td>
                                    <Td textAlign={'center'}>{study.seriescnt}</Td>
                                    <Td textAlign={'center'}>{study.imagecnt}</Td>
                                    <Td textAlign={'center'}>{study.verifyflag}</Td>
                                </Tr>
                            ))}
                        </CheckboxGroup>
                    </Tbody>
                </Table>
            </TableContainer >
        </>
    );
}

export function toStringReportStatus(status: number) {
    switch (status) {
        case 3:
            return "읽지않음";
        case 4:
            return "열람중";
        case 5:
            return "예비판독";
        case 6:
            return "판독";
    }
}