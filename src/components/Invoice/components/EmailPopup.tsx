import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Box,
  IconButton,
  Checkbox,
  Text,
  Grid,
  FormErrorMessage,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { App_Base_URL } from "../../../constant";
import axios from "axios";

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  customerId: string;
}

const EmailPopup: React.FC<EmailPopupProps> = ({
  isOpen,
  onClose,
  invoiceId,
  customerId,
}) => {
  const [recipients, setRecipients] = useState([""]);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [from, setFrom] = useState<string>("alagappantest@gmail.com");
  const [errors, setErrors] = useState<string[]>([]);
  const [isAttachAsPdf, setIsAttachAsPdf] = useState<boolean>(false);
  const [sendCopyToMyself, setSendCopyToMyself] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddRecipient = () => {
    setRecipients([...recipients, ""]);
    setErrors([...errors, ""]);
  };

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;

    const newErrors = [...errors];
    if (!emailRegex.test(value) && value !== "") {
      newErrors[index] = "Invalid email address";
    } else {
      newErrors[index] = "";
    }

    setRecipients(newRecipients);
    setErrors(newErrors);
  };

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setRecipients(newRecipients);
    setErrors(newErrors);
  };

  const handleModalClose = () => {
    setRecipients([""]); // Reset to initial state with one input
    setErrors([""]); // Reset errors
    setBody(""); // Reset body
    setIsAttachAsPdf(false);
    setSendCopyToMyself(false);
    onClose(); // Call the provided onClose function
  };

  useEffect(() => {
    if (customerId) {
      // Fetch the customer data
      const fetchCustomer = async () => {
        try {
          const response = await axios.get(
            `${App_Base_URL}/Customer/${customerId}`
          );
          setCustomerEmail(response.data.email);
        } catch (error) {
          console.error("Error fetching customer data:", error);
          // Handle the error appropriately
        }
      };

      fetchCustomer();
    }
  }, [customerId]);

  const handleSend = async () => {
    // Validate all recipient emails
    const newErrors = recipients.map((email) =>
      email && !emailRegex.test(email) ? "Invalid email address" : ""
    );
    setErrors(newErrors);

    // Check if any errors exist
    if (newErrors.some((error) => error)) {
      return;
    }
    // Construct the payload
    const payload = {
      InvoiceId: invoiceId,
      From: from,
      ToEmail: customerEmail,
      Subject: subject,
      Body: body,
      Cc: recipients.filter(Boolean).join(", "), // Join valid CC emails into a string
      IsAttachPdf: isAttachAsPdf,
      SendCopyToMyself: sendCopyToMyself,
    };

    try {
      await axios.post(`${App_Base_URL}/Invoice/email`, payload);
      handleModalClose();
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="lg">
      <ModalOverlay />
      <ModalContent
        maxH="80vh"
        overflowY="auto"
        borderRadius="lg"
        shadow="xl"
        bg="gray.50"
        p={4}
      >
        <ModalHeader fontSize="xl" fontWeight="bold" color="blue.600">
          Email Invoice
        </ModalHeader>
        <ModalBody>
          <Stack spacing={5}>
            <FormControl id="from">
              <Grid templateColumns={"70px 1fr"} gap={4} alignItems="center">
                <FormLabel fontWeight="bold" color="gray.700" w="70px">
                  From
                </FormLabel>
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  focusBorderColor="blue.500"
                  bg="white"
                  shadow="sm"
                  fontSize="15px"
                  value={from}
                  readOnly
                  style={{ fontSize: "14px" }}
                />
              </Grid>
            </FormControl>
            <FormControl id="to">
              <Grid templateColumns={"70px 1fr"} gap={4} alignItems="center">
                <FormLabel fontWeight="bold" color="gray.700" w="70px">
                  To
                </FormLabel>
                <Input
                  type="email"
                  value={customerEmail}
                  fontSize="15px"
                  isReadOnly
                  focusBorderColor="blue.500"
                  bg="white"
                  shadow="sm"
                  mb={2}
                  style={{ fontSize: "14px" }}
                />
              </Grid>
              {recipients.slice(1).map((recipient, index) => (
                <FormControl
                  isInvalid={errors[index + 1] !== ""}
                  key={index + 1}
                >
                  <Grid
                    templateColumns={"70px 1fr auto"}
                    gap={4}
                    alignItems="center"
                    mb={2}
                  >
                    <Box w="70px"></Box>
                    <Input
                      type="email"
                      placeholder={`recipient-${index + 2}@example.com`}
                      value={recipient}
                      onChange={(e) =>
                        handleRecipientChange(index + 1, e.target.value)
                      }
                      focusBorderColor="blue.500"
                      bg="white"
                      shadow="sm"
                      style={{ fontSize: "14px" }}
                    />
                    <IconButton
                      aria-label="Remove recipient"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveRecipient(index + 1)}
                      variant="ghost"
                    />
                  </Grid>
                  <Grid
                    templateColumns={"70px 1fr"}
                    gap={4}
                    alignItems="center"
                  >
                    <FormLabel
                      fontWeight="bold"
                      color="gray.700"
                      w="70px"
                    ></FormLabel>
                    {errors[index + 1] && (
                      <FormErrorMessage>{errors[index + 1]}</FormErrorMessage>
                    )}
                  </Grid>
                </FormControl>
              ))}
              <Grid
                templateColumns={"70px 1fr"}
                gap={4}
                alignItems="center"
                mt={2}
              >
                <Box w="70px"></Box>
                <Button
                  leftIcon={<AddIcon />}
                  onClick={handleAddRecipient}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  fontSize="13px"
                  w="140px"
                >
                  Add Recipient
                </Button>
              </Grid>
            </FormControl>
            <FormControl id="subject">
              <Grid templateColumns={"70px 1fr"} gap={4} alignItems="center">
                <FormLabel fontWeight="bold" color="gray.700" w="70px">
                  Subject
                </FormLabel>
                <Input
                  placeholder="Enter subject"
                  focusBorderColor="blue.500"
                  bg="white"
                  shadow="sm"
                  style={{ fontSize: "14px" }}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Grid>
            </FormControl>
            <FormControl id="body">
              <Grid templateColumns={"70px 1fr"} gap={4} alignItems="center">
                <FormLabel fontWeight="bold" color="gray.700" w="70px">
                  Body
                </FormLabel>
                <Box
                  bg="white"
                  shadow="sm"
                  borderRadius="md"
                  borderColor="gray.200"
                  borderWidth="1px"
                  p={3}
                  w="full"
                  h="240px"
                >
                  <ReactQuill
                    value={body}
                    onChange={setBody}
                    placeholder="Write your message here..."
                    theme="snow"
                    style={{ height: "150px", fontSize: "14px" }}
                  />
                </Box>
              </Grid>
            </FormControl>
            <Grid templateColumns={"70px 1fr"} gap={4} alignItems="center">
              <Box w="70px"></Box>
              <Stack spacing={6}>
                <Checkbox
                  colorScheme="blue"
                  isChecked={isAttachAsPdf}
                  onChange={(e) => setIsAttachAsPdf(e.target.checked)}
                >
                  <Text fontSize="15px">Attach the Invoice as a PDF</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="blue"
                  isChecked={sendCopyToMyself}
                  onChange={(e) => setSendCopyToMyself(e.target.checked)}
                >
                  <Text fontSize="15px">Send a copy to myself</Text>
                </Checkbox>
              </Stack>
            </Grid>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            size="md"
            fontWeight="bold"
            variant="outline"
            onClick={handleSend}
          >
            Send
          </Button>
          <Button
            variant="ghost"
            size="md"
            fontWeight="bold"
            colorScheme="gray"
            onClick={handleModalClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmailPopup;
