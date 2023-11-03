import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import StudyPreviousList from "./StudyPreviousList";

export interface IPreviousProps {
    "pname": string;
    "pid": string;
}

export default function StudyPreviousModal({ pname, pid }: IPreviousProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button size={'xs'} onClick={onOpen}>{pname}</Button>
            <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{pname} (ID : {pid})</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <StudyPreviousList pid={pid} pname={pname} />
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
    )
}