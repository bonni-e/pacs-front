import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    useDisclosure,
    PopoverCloseButton,
} from '@chakra-ui/react'
import { IoMdSearch } from "react-icons/io";
import { IStudyProps } from './StudyList';
import DicomViewer from './SeriesViewer';

export interface IDicomViewerModalProps {
    "study": IStudyProps
}

export default function DicomViewerModal({ study }: IDicomViewerModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();



    return (
        <>
            <IconButton onClick={onOpen} aria-label='dicom viwer' variant={'link'} colorScheme='blue' icon={<IoMdSearch />} />

            <Modal isOpen={isOpen} onClose={onClose} size={'full'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Popover>
                            
                                <PopoverTrigger>
                                    <Button variant={'link'} size={'lg'} mr={'10px'}>
                                        {study.pname} (ID : {study.pid})
                                    </Button>
                                </PopoverTrigger>
                               
                            <PopoverContent color='white' bg='blue.800' borderColor='blue.800' ml={"20px"}>
                                <PopoverArrow bg='blue.800' />
                                <PopoverCloseButton />
                                <PopoverHeader pt={4} fontWeight='bold' border='0'>Infomation</PopoverHeader>
                                <PopoverBody fontSize={'sm'} pb={8} fontWeight={'light'}>
                                    studykey : {study.studykey}<br />
                                    modality: {study.modality}<br />
                                    studydesc: {study.studydesc}<br />
                                    studydate: {study.studydate}<br />
                                    seriescnt: {study.seriescnt}<br />
                                    imagecnt: {study.imagecnt}<br />
                                    reportstatus: {study.reportstatus}<br />
                                    verifyflag: {study.verifyflag}<br />
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <DicomViewer study={study} />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}