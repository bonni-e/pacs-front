import { Box, Center, Divider, HStack, IconButton, Input, Select, Tag, TagLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import StudyList from "./StudyList";
import { FcNext, FcPrevious } from 'react-icons/fc';

export default function SearchBar() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Fetching
    const [isLoading, setIsLoading] = useState(true);
    const [studies, setStudies] = useState([]);
    const fetchStudies = async () => {
        const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/studies?page=${page}&pageSize=${pageSize}`, { method: 'POST' });
        const json = await response.json();
        setStudies(json);
        setIsLoading(false);
    }
    useEffect(() => {
        fetchStudies();
    }, [page, pageSize]);

    function changePageSize(e: React.ChangeEvent<HTMLSelectElement>) {
        const page = parseInt(e.target.value);
        console.log('page : ', page);
        setPageSize(page);
        fetchStudies();
    }

    return (
        <>
            <Box margin={'23px'}>
                <HStack >
                    <Input variant={'filled'} placeholder="환자아이디" />
                    <Input variant={'filled'} placeholder="환자이름" />
                    <Select variant={'filled'}>
                        <option value={''} selected disabled>판독상태</option>
                        <option value={'3'} >읽지않음</option>
                        <option value={'4'} >열람중</option>
                        <option value={'5'} >예비판독</option>
                        <option value={'6'} >판독</option>
                    </Select>
                </HStack>
                <HStack mt={'20px'} justifyContent={'center'}>
                    {['전체', '1일', '3일', '1주일', '재설정'].map((tagName) => (
                        <Tag size={'lg'} key={tagName} variant='outline' colorScheme='blackAlpha'>
                            <TagLabel>{tagName}</TagLabel>
                        </Tag>
                    ))}
                    <Center height='30px' margin={'0 15px 0 15px'}>
                        <Divider orientation='vertical' />
                    </Center>
                    {['다운로드', '검사삭제'].map((tagName) => (
                        <Tag size={'lg'} key={tagName} variant='outline' colorScheme='blackAlpha'>
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
                    <IconButton aria-label='Previous Page' icon={<FcPrevious />} />
                    <IconButton aria-label='Next Page' icon={<FcNext />} />
                </HStack>
            </Center>
        </>
    );
}