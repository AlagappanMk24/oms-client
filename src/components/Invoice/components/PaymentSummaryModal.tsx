import {
  Button,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  RadioGroup,
  Radio,
  Box,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/Invoice.css";

interface PaymentSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountToBePaid: string;
}

const PaymentSummaryModal: React.FC<PaymentSummaryModalProps> = ({
  isOpen,
  onClose,
  amountToBePaid,
}) => {
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [partiallyPayAmount, setPartiallyPayAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxHeight="100vh" overflowY="auto" >
        <ModalHeader
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          bg="teal.500"
          color="white"
          borderRadius="md"
          fontFamily="Roboto, sans-serif"
        >
          Payment Summary
        </ModalHeader>
        <ModalBody p={8} bg="gray.50">
          <VStack spacing={4} align="stretch">
            <Box mb={4}>
              <Flex align="center" mb={2}>
                <FormLabel fontSize="16px" width="200px">
                  Payment Type
                </FormLabel>
                <RadioGroup
                  onChange={(value) =>
                    setPaymentType(value as "full" | "partial")
                  }
                  value={paymentType}
                >
                  <Flex>
                    <Radio value="full" colorScheme="teal" mr={4}>
                      Full Paid
                    </Radio>
                    <Radio value="partial" colorScheme="teal">
                      Partially Paid
                    </Radio>
                  </Flex>
                </RadioGroup>
              </Flex>
            </Box>
            <Flex direction="column" gap={4}>
              {/* Invoice Date */}
              <Flex align="center" mb={4}>
                <FormLabel fontSize="16px" width="200px">
                  Invoice Date
                </FormLabel>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  size="md"
                  flex="1"
                  borderColor="teal.300"
                  borderWidth="2px"
                  _focus={{ borderColor: "teal.500" }}
                />
              </Flex>

              {/* Amount to be Paid */}
              <Flex align="center" mb={4}>
                <FormLabel fontSize="16px" width="200px">
                  Amount to be Paid
                </FormLabel>
                <Input
                  type="text"
                  value={amountToBePaid}
                  isReadOnly
                  size="md"
                  bg="white"
                  borderColor="teal.300"
                  borderWidth="2px"
                  _focus={{ borderColor: "teal.500" }}
                  flex="1"
                />
              </Flex>

              {/* Conditionally Render Partial Payment Fields */}
              {paymentType === "partial" && (
                <>
                {}
                  {/* Payment Due Date */}
                  <Flex align="center" mb={4}>
                    <FormLabel
                      fontSize="16px"
                      width="200px"
                    >
                      Pay Amount
                    </FormLabel>
                    <Input
                      type="number"
                      value={partiallyPayAmount}
                      onChange={(e) => setPartiallyPayAmount(e.target.value)}
                      size="md"
                      flex="1"
                      borderColor="teal.300"
                      borderWidth="2px"
                      _focus={{ borderColor: "teal.500" }}
                      fontFamily="Roboto, sans-serif"
                      placeholder="Enter partial amount"
                    />
                  </Flex>
                </>
              )}

              {/* Notes */}
                <FormLabel fontSize="16px" width="200px">
                  Notes
                </FormLabel>
                <Box
                  // flex="1"
                  w="full"
                  bg="white"
                  borderColor="teal.300"
                  borderWidth="2px"
                  borderRadius="md"
                >
                  <ReactQuill
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Enter notes or terms of service"
                    className="custom-react-quill"
                  />
                </Box>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            colorScheme="teal"
            mr={5}
            onClick={() => {
              // Handle Save
              onClose();
            }}
          >
            Save
          </Button>
          <Button variant="outline" colorScheme="teal" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentSummaryModal;
