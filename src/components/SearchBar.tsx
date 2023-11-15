import { Box, Center, Divider, HStack, IconButton, Input, Link, Select, Tag, TagLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import StudyList from "./StudyList";
import { FcNext, FcPrevious } from 'react-icons/fc';

export default function SearchBar() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPageCount, setTotalPageCount] = useState(1);

    const [periods, setPeriods] = useState(9999);
    const [pid, setPid] = useState('');
    const [pname, setPname] = useState('');
    const [reportstatus, setReportstatus] = useState(0);

    // Fetching
    const apiUrl = `${process.env.REACT_APP_MYPACS_SERVER}`;

    const [isLoading, setIsLoading] = useState(true);
    const [studies, setStudies] = useState([]);

    const fetchStudies = async () => {
        const response = await fetch(`${apiUrl}/v1/api/pacs/studies?page=${page}&pageSize=${pageSize}&periods=${periods}`, { method: 'GET' });
        const json = await response.json();
        setStudies(json.list);
        setTotalPageCount(json.totalPageCount);
        setIsLoading(false);
    }

    const fetchSortStudies = async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const data = {
            "pid": pid,
            "pname": pname,
            "reportstatus": reportstatus
        };
        const response = await fetch(`${apiUrl}/v1/api/pacs/studies?page=${page}&pageSize=${pageSize}&periods=${periods}`, { method: 'POST', headers: headers, body: JSON.stringify(data) });
        const json = await response.json();
        setStudies(json.list);
        setTotalPageCount(json.totalPageCount);
        setIsLoading(false);
    }

    useEffect(() => {
        if (pid !== '' || pname !== '' || reportstatus !== 0)
            fetchSortStudies();
        else
            fetchStudies();
    }, [pid, pname, reportstatus, page, pageSize, periods]);

    function changePageSize(e: React.ChangeEvent<HTMLSelectElement>) {
        const pageSizeValue = parseInt(e.target.value);
        setPage(1);
        setPageSize(pageSizeValue);
    }

    function changePagePrevious() {
        if (page > 1)
            setPage(page - 1);
    }

    function changePageNext() {
        if (page < totalPageCount)
            setPage(page + 1);
    }

    function sortPageWithPid(e: React.ChangeEvent<HTMLInputElement>) {
        setPage(1);
        setPid(e.target.value);
    }

    function sortPageWithPname(e: React.ChangeEvent<HTMLInputElement>) {
        setPage(1);
        setPname(e.target.value);
    }

    function sortPageWithReportstatus(e: React.ChangeEvent<HTMLSelectElement>) {
        setPage(1);
        setReportstatus(parseInt(e.target.value));
    }

    function changePeriod(tagName: string) {
        setPage(1);
        if (tagName === '전체')
            setPeriods(9999);
        else if (tagName === '1일')
            setPeriods(1);
        else if (tagName === '3일')
            setPeriods(3);
        else if (tagName === '1주일')
            setPeriods(7);
        else if (tagName === '6개월')
            setPeriods(180);
        else if (tagName === '1년')
            setPeriods(360);
    }

    return (
        <>
            <Box margin={'23px'}>
                <HStack >
                    <Input onChange={sortPageWithPid} variant={'filled'} placeholder="환자아이디" />
                    <Input onChange={sortPageWithPname} variant={'filled'} placeholder="환자이름" />
                    <Select defaultValue={''} onChange={sortPageWithReportstatus} variant={'filled'}>
                        <option value={''} >판독상태</option>
                        <option value={'3'} >읽지않음</option>
                        <option value={'4'} >열람중</option>
                        <option value={'5'} >예비판독</option>
                        <option value={'6'} >판독</option>
                    </Select>
                </HStack>
                <HStack mt={'20px'} justifyContent={'center'}>
                    {['전체', '1일', '3일', '1주일', '6개월', '1년'].map((tagName) => (
                        <Tag onClick={() => {
                            changePeriod(tagName);
                        }} size={'lg'} key={tagName} variant='outline' colorScheme='blackAlpha' _hover={{
                            "cursor": "pointer",
                            "color": "whitesmoke",
                            "bg": "blue.500",
                            "boxShadow": "none"
                        }}>
                            <TagLabel>{tagName}</TagLabel>
                        </Tag>
                    ))}
                    <Center height='30px' margin={'0 15px 0 15px'}>
                        <Divider orientation='vertical' />
                    </Center>
                    {['다운로드', '검사삭제'].map((tagName) => (
                        <Tag size={'lg'} key={tagName} variant='outline' colorScheme='blackAlpha' _hover={{
                            "cursor": "pointer",
                            "color": "whitesmoke",
                            "bg": "blackAlpha.700",
                        }}>
                            <TagLabel>{tagName}</TagLabel>
                        </Tag>
                    ))}
                    <Select defaultValue={'5'} onChange={changePageSize} name='pagesize' w='10%' h={'32px'} borderColor={"blackAlpha.500"} color={"blackAlpha.900"} minW={'100px'}>
                        <option value={'5'}>5개씩 보기</option>
                        <option value={'10'}>10개씩 보기</option>
                        <option value={'20'}>20개씩 보기</option>
                    </Select>
                </HStack>
            </Box>
            <StudyList studies={studies} />
            <Center mt={'10px'}>
                <HStack>
                    <IconButton onClick={changePagePrevious} aria-label='Previous Page' icon={<FcPrevious />} />
                    <IconButton onClick={changePageNext} aria-label='Next Page' icon={<FcNext />} />
                </HStack>
            </Center>
        </>
    );
}