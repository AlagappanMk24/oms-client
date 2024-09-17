/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  InputRightElement,
  StackDivider,
  Flex,
  Icon,
  Text,
  Divider,
  Link,
  Switch,
  InputGroup,
  Skeleton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiUserPlus, FiMail, FiPhone, FiFileText } from "react-icons/fi";
import axios from "axios";
import { App_Base_URL } from "../../../constant";
import { addDays, format, parseISO } from "date-fns";
import CustomerModal from "./CustomerModal";
import { InvoiceAttachment, InvoiceItem, Location } from "../types/InvoiceType";
import { Customer } from "../../Customer/CustomerType";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Layout from "../../Layout/Layout";
import { Image } from "@chakra-ui/react";
import PaymentSummaryModal from "./PaymentSummaryModal";
import Swal from "sweetalert2";

const AddInvoice = () => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [currency, setCurrency] = useState<string>("");
  const [invoiceDueDate, setInvoiceDueDate] = useState<string>("");
  const [paymentDueDate, setPaymentDueDate] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [manualInvoiceNumber, setManualInvoiceNumber] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [poNumber, setPoNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [useRichText, setUseRichText] = useState(false);
  // State for holding uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // State for holding invoice attachments in edit mode
  const [invoiceAttachments, setInvoiceAttachments] = useState<
    InvoiceAttachment[]
  >([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditInvoice, setIsEditInvoice] = useState(false);
  const [paymentTerm, setPaymentTerm] = useState<string>("");
  const [customDate, setCustomDate] = useState<string>("");
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams(); // Get the invoice ID from the route parameters
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    location: "",
    invoiceNumber: "",
    poNumber: "",
    invoiceDueDate: "",
    paymentDueDate: "",
    items: "",
  });
  // Fetch locations when the component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${App_Base_URL}/Location`);
        const locationData = response.data as Location[];
        setLocations(locationData);
        if (locationData.length > 0) {
          setCurrency(locationData[0].currency.symbol);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    // Update currency symbol based on selected location
    const selectedLoc = locations.find(
      (location) => location.id === selectedLocation?.id
    );
    if (selectedLoc) {
      setCurrency(selectedLoc.currency.symbol);
      setSelectedLocation(selectedLoc);
    }
  }, [selectedLocation, locations]);

  useEffect(() => {
    calculateTotals();
  }, [items, tax, discount]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsEditInvoice(true);

      // Fetch the invoice data
      const fetchInvoice = async () => {
        try {
          const response = await axios.get(`${App_Base_URL}/Invoice/${id}`);
          const invoice = response.data;

          // Extracting and formatting dates
          const formattedInvoiceDueDate = format(
            parseISO(invoice.invoiceDue),
            "yyyy-MM-dd"
          );
          const formattedPaymentDueDate = format(
            parseISO(invoice.paymentDue),
            "yyyy-MM-dd"
          );
          console.log("Invoice Due Date:", formattedInvoiceDueDate);
          console.log("Payment Due Date:", formattedPaymentDueDate);

          // Set the fetched invoice data to the state variables
          setLoading(false);
          setSelectedCustomer(invoice.customer);
          // setSelectedLocation(invoice.locationId);
          const selectedLoc = locations.find(
            (location) => location.id === invoice.locationId
          );
          if (selectedLoc) {
            setSelectedLocation(selectedLoc);
          }
          setInvoiceDueDate(formattedInvoiceDueDate);
          setPaymentDueDate(formattedPaymentDueDate);
          setItems(invoice.invoiceItems);
          setInvoiceNumber(invoice.invoiceNumber);
          setPoNumber(invoice.poNumber);
          setNotes(invoice.notes);
          setTax(invoice.tax);
          setDiscount(invoice.discount);
          setSubtotal(invoice.subtotal);
          setTotalAmount(invoice.totalAmount);
          setInvoiceAttachments(invoice.invoiceAttachments || []);
        } catch (error) {
          console.error("Error fetching invoice:", error);
        }
      };
      // Ensure locations are loaded before fetching invoice
      if (locations.length > 0) {
        fetchInvoice();
      }
    }
  }, [id, locations]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${App_Base_URL}/Customer`);
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: 0,
        service: "",
        description: "",
        unit: 0,
        price: 0,
        amount: 0,
        invoiceId: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleInvoiceDueDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = e.target.value;
    setInvoiceDueDate(date);
    calculatePaymentDueDate(date, paymentTerm);
  };

  const handlePaymentTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value;
    setPaymentTerm(term);
    calculatePaymentDueDate(invoiceDueDate, term);
  };

  const calculatePaymentDueDate = (invoiceDue: string, term: string) => {
    if (!invoiceDue || !term) return;

    let daysToAdd = 0;
    switch (term) {
      case "net15":
        daysToAdd = 15;
        break;
      case "net30":
        daysToAdd = 30;
        break;
      case "net60":
        daysToAdd = 60;
        break;
      case "net90":
        daysToAdd = 90;
        break;
      default:
        break;
    }

    const paymentDue = addDays(new Date(invoiceDue), daysToAdd);
    setPaymentDueDate(format(paymentDue, "yyyy-MM-dd"));
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setCustomDate(date);
    if (paymentTerm === "custom") {
      setPaymentDueDate(date);
    }
  };

  const updateCustomersList = (newCustomer: Customer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
  };

  const calculateTotals = () => {
    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const calculatedTotal = calculatedSubtotal + tax - discount;
    setSubtotal(calculatedSubtotal);
    setTotalAmount(calculatedTotal);
  };

  const openModal = () => {
    setSelectedCustomerId(selectedCustomer?.id || null);
    setModalVisible(true);
    setIsEditInvoice(true);
    setIsEditMode(false);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleInvoiceNumberMode = () => {
    setManualInvoiceNumber(!manualInvoiceNumber);
    if (!manualInvoiceNumber) {
      setInvoiceNumber("");
    }
  };

  const handleStringItemChange = (
    index: number,
    field: "service" | "description",
    value: string
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleNumberItemChange = (
    index: number,
    field: "unit" | "price",
    value: string
  ) => {
    const newItems = [...items];
    const numericValue = parseFloat(value);
    newItems[index][field] = isNaN(numericValue) ? 0 : numericValue;
    newItems[index].amount = newItems[index].unit * newItems[index].price;
    setItems(newItems);
  };
  const handleEditCustomer = () => {
    setModalVisible(true);
    setIsEditMode(true);
  };

  const uploadFile = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    const response = await axios.post(`${App_Base_URL}/uploadFile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const handleSaveInvoice = async () => {
    let hasErrors = false;
    const newErrors = {
      location: "",
      invoiceNumber: "",
      poNumber: "",
      invoiceDueDate: "",
      paymentDueDate: "",
      items: "",
    };
    // Ensure a customer is selected before proceeding
    if (!selectedCustomer) {
      Swal.fire({
        icon: "warning",
        title: "No Customer Selected",
        text: "Please select a customer before saving the invoice.",
      });
      return; // Return early if no customer is selected
    }

    // Validation for location
    if (!selectedLocation) {
      newErrors.location = "Please select a location.";
      hasErrors = true;
    }

    // Validation for invoice number (if manual input is enabled)
    if (manualInvoiceNumber && !invoiceNumber) {
      newErrors.invoiceNumber = "Please provide an invoice number.";
      hasErrors = true;
    }

    // Validation for P.O./S.O. number
    if (!poNumber) {
      newErrors.poNumber = "Please provide a P.O./S.O. number.";
      hasErrors = true;
    }

    // Validation for invoice due date
    if (!invoiceDueDate) {
      newErrors.invoiceDueDate = "Please select an invoice due date.";
      hasErrors = true;
    }

    // Validation for payment due date (if custom date is selected)
    if (paymentTerm === "custom" && !customDate) {
      newErrors.paymentDueDate = "Please provide a custom payment due date.";
      hasErrors = true;
    }

    // Validation for invoice items
    if (items.length === 0) {
      newErrors.items = "Please add at least one item to the invoice.";
      hasErrors = true;
    }

    setErrors(newErrors);

    // If there are any errors, do not proceed
    if (hasErrors) return;
    try {
      // Collect the file URLs and names
      const fileAttachments = await Promise.all(
        uploadedFiles.map(async (file) => {
          const { url } = await uploadFile(file);
          return {
            attachmentName: file.name,
            attachmentContent: url,
          };
        })
      );

      const invoiceData = {
        customerId: selectedCustomer?.id,
        locationId: selectedLocation,
        invoiceDue: invoiceDueDate,
        paymentDue: paymentDueDate,
        invoiceItems: items,
        invoiceNumber: manualInvoiceNumber ? invoiceNumber : null,
        poNumber: poNumber,
        notes,
        subtotal,
        tax,
        discount,
        totalAmount,
        invoiceAttachments: [
          ...invoiceAttachments,
          ...fileAttachments, // Combine existing and new attachments
        ],
      };
      if (isEditInvoice && id) {
        await axios.put(`${App_Base_URL}/Invoice/${id}`, invoiceData);
      } else {
        await axios.post(`${App_Base_URL}/Invoice`, invoiceData);
      }
      navigate("/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handlePreview = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const handleRemove = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemoveAttachment = (index: number) => {
    setInvoiceAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index)
    );
  };

  const handleSwitchChange = () => {
    setUseRichText(!useRichText);
  };

  const renderSkeletonRows = () => {
    const rows = Array.from({ length: 10 }, (_, index) => (
      <Flex key={index} mb="2">
        <Skeleton height="40px" mb="4" width="100%" />
        <Skeleton height="30px" mb="4" width="100%" />
        <Skeleton height="30px" mb="4" width="100%" />
        <Skeleton height="30px" mb="4" width="100%" />
        <Skeleton height="30px" mb="4" width="100%" />
      </Flex>
    ));
    return rows;
  };
  const getSelectedLocationLogo = () => {
    const selectedLoc = locations.find(
      (location) => location.id === selectedLocation?.id
    );
    return selectedLoc ? selectedLoc.logo : "";
  };

  const updateInvoiceStatus = async (id: number, status: string) => {
    if (status === "Paid") {
      // Open the payment summary modal when marking as paid
      onOpen();
    } else {
      try {
        const response = await axios.patch(
          `/api/invoices/${id}/status`,
          status
        );
        console.log(`Invoice status updated: ${response.data}`);

        // Success notification with SweetAlert
        Swal.fire({
          title: "Success!",
          text: `Invoice status updated to ${status}`,
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      } catch (error: unknown) {
        // Type-checking the error and handling different types
        if (axios.isAxiosError(error)) {
          // Axios-specific error handling
          Swal.fire({
            title: "Error!",
            text: `Failed to update invoice status: ${
              error.response?.data || error.message
            }`,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else if (error instanceof Error) {
          // General JavaScript error handling
          Swal.fire({
            title: "Error!",
            text: `Failed to update invoice status: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          // Unknown error handling
          Swal.fire({
            title: "Error!",
            text: "An unknown error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }

        console.error("Error updating invoice status:", error);
      }
    }
  };

  return (
    <Flex>
      <Layout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "4rem",
            width: "100%",
          }}
        >
          {loading ? (
            <Box width="80%">
              <Skeleton height="40px" mb="4" width="100%" />
              {renderSkeletonRows()}
            </Box>
          ) : (
            <>
              <Box
                maxW="container.lg"
                width="80%"
                mx="auto"
                p={10}
                bg="white"
                shadow="md"
                borderRadius="md"
                border="1px solid #80808052"
              >
                <Flex justify="space-between" mb={3}>
                  <Box width="full">
                    <FormLabel fontSize="2xl" fontWeight="bold">
                      {id ? "Edit Invoice" : "New Invoice"}
                    </FormLabel>
                  </Box>
                  {id ? (
                    <Menu>
                      <MenuButton as={Button} colorScheme="blue">
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => updateInvoiceStatus(parseInt(id), "Sent")}
                        >
                          Mark as Sent
                        </MenuItem>
                        <MenuItem
                          onClick={() => updateInvoiceStatus(parseInt(id), "Paid")}
                        >
                          Mark as Paid
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <></>
                  )}
                </Flex>
                <Flex alignItems="center" mb={5}>
                  <Divider borderColor="gray.300" borderWidth={2} flex="1" />
                  <Icon as={FiFileText} boxSize={6} color="teal.500" mx={2} />
                  <Divider borderColor="gray.300" borderWidth={2} flex="1" />
                </Flex>
                <VStack
                  spacing={6}
                  divider={<StackDivider borderColor="gray.200" />}
                >
                  {selectedLocation && (
                    <Box
                      width="full"
                      p={6}
                      borderWidth={1}
                      borderRadius="lg"
                      bg="white"
                      boxShadow="lg"
                    >
                      <FormLabel
                        fontSize="2xl"
                        fontWeight="bold"
                        color="gray.800"
                        mb={6}
                        textAlign={{ base: "center", md: "left" }}
                      >
                        Business Address and Contact Details
                      </FormLabel>
                      <Flex
                        direction={{ base: "column", md: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        p={6}
                        borderWidth={1}
                        borderRadius="lg"
                        bg="gray.50"
                        boxShadow="md"
                      >
                        {/* Logo Section */}
                        <Box
                          flex="1"
                          textAlign={{ base: "center", md: "left" }}
                          mb={{ base: 6, md: 0 }}
                        >
                          <Image
                            src={getSelectedLocationLogo()}
                            alt="Location Logo"
                            maxHeight="120px"
                            maxWidth="120px"
                            borderRadius="full"
                            boxShadow="md"
                            border="2px solid"
                            borderColor="gray.200"
                          />
                        </Box>

                        {/* Contact Information Section */}
                        <Box
                          flex="2"
                          pl={{ md: 6 }}
                          textAlign={{ base: "center", md: "left" }}
                        >
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="gray.700"
                            mb={2}
                          >
                            {selectedLocation?.companyName}
                          </Text>
                          <Text fontSize="md" color="gray.600">
                            {selectedLocation?.email}{" "}
                          </Text>
                          <Text fontSize="md" color="gray.600">
                            {selectedLocation?.phone}{" "}
                          </Text>
                          <Text fontSize="md" color="gray.600">
                            {selectedLocation?.address}{" "}
                          </Text>
                          <Text fontSize="md" color="gray.600">
                            {selectedLocation?.city}, {selectedLocation?.state}
                          </Text>
                          <Text fontSize="md" color="gray.600">
                            {selectedLocation?.country} -{" "}
                            {selectedLocation?.postalCode}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  )}

                  <Box
                    width="full"
                    p={6}
                    borderWidth={1}
                    borderRadius="md"
                    bg="white"
                  >
                    <Flex direction="row" width="full">
                      {!isEditInvoice || !selectedCustomer ? (
                        <div
                          id="div1"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50%",
                          }}
                          onClick={openModal}
                        >
                          <Box mr={6}>
                            <FormControl>
                              <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                p={5}
                                border="1px solid"
                                borderColor="gray.400"
                                borderRadius="md"
                                cursor="pointer"
                              >
                                <Icon as={FiUserPlus} boxSize={10} mb={3} />
                                <Box>{"Add Customer"}</Box>
                              </Flex>
                            </FormControl>
                          </Box>
                        </div>
                      ) : (
                        <div
                          id="div2"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50%",
                          }}
                        >
                          <Box>
                            <VStack align="start" spacing={2}>
                              <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color="teal.600"
                              >
                                {selectedCustomer?.name}
                              </Text>
                              <Divider borderColor="gray.300" />
                              <Flex align="center">
                                <Icon as={FiMail} boxSize={4} mr={2} />
                                <Text fontSize="md" color="gray.700">
                                  {selectedCustomer?.email}
                                </Text>
                              </Flex>
                              <Flex align="center">
                                <Icon as={FiPhone} boxSize={4} mr={2} />
                                <Text fontSize="md" color="gray.700">
                                  {selectedCustomer?.phoneNumber}
                                </Text>
                              </Flex>
                              <Text fontSize="md" color="gray.700">
                                {selectedCustomer?.address?.address1} ,{" "}
                                {selectedCustomer?.address?.address2}
                              </Text>
                              <Text fontSize="md" color="gray.700">
                                {selectedCustomer?.address?.city} ,{" "}
                                {selectedCustomer?.address?.state} -{" "}
                                {selectedCustomer?.address?.zipCode}
                              </Text>
                              <Text fontSize="md" color="gray.700">
                                {selectedCustomer?.address?.country} .
                              </Text>
                              <Flex gap="10px" width="full" mt={4}>
                                <Button
                                  colorScheme="blue"
                                  variant="outline"
                                  borderColor="blue.500"
                                  color="blue.500"
                                  onClick={openModal}
                                >
                                  <Text fontSize="13px">
                                    Choose Different Customer
                                  </Text>
                                </Button>
                                <Button
                                  colorScheme="teal"
                                  variant="outline"
                                  borderColor="teal.500"
                                  color="teal.500"
                                  onClick={handleEditCustomer}
                                >
                                  <Text fontSize="13px">Edit</Text>
                                </Button>
                              </Flex>
                            </VStack>
                          </Box>
                        </div>
                      )}

                      <div style={{ width: "60%" }}>
                        <Box width="full">
                          <FormControl mb={4} isInvalid={!!errors.location}>
                            <Flex alignItems="center">
                              <FormLabel width="150px" mb={0}>
                                Location
                              </FormLabel>
                              <Select
                                placeholder="Select location"
                                value={selectedLocation?.id}
                                onChange={(e) => {
                                  const selectedId = parseInt(e.target.value);
                                  const selectedLoc =
                                    locations.find(
                                      (loc) => loc.id === selectedId
                                    ) || null;
                                  setSelectedLocation(selectedLoc);
                                }}
                                flex="1"
                                fontSize="14px"
                              >
                                {locations.map((location) => (
                                  <option key={location.id} value={location.id}>
                                    {location.country}
                                  </option>
                                ))}
                              </Select>
                            </Flex>
                            {errors.location && (
                              <FormErrorMessage>
                                {errors.location}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                          <FormControl
                            mb={4}
                            isInvalid={!!errors.invoiceNumber}
                          >
                            <Flex alignItems="center">
                              <FormLabel width="150px">
                                Invoice Number:
                              </FormLabel>
                              {manualInvoiceNumber ? (
                                <Input
                                  type="text"
                                  value={invoiceNumber}
                                  onChange={(e) =>
                                    setInvoiceNumber(e.target.value)
                                  }
                                  placeholder="Enter Invoice Number"
                                  required
                                  flex="1"
                                  fontSize="14px"
                                />
                              ) : (
                                <Input
                                  color="gray.600"
                                  flex="1"
                                  value={invoiceNumber || "Auto-generated"}
                                  readOnly
                                  fontSize="14px"
                                />
                              )}
                            </Flex>
                            <Flex>
                              <FormLabel width="150px"></FormLabel>
                              <Link
                                fontSize="sm"
                                onClick={toggleInvoiceNumberMode}
                                cursor="pointer"
                                color="blue.500"
                                mt={2}
                              >
                                {manualInvoiceNumber
                                  ? "Switch to Automated"
                                  : "Switch to Manual"}
                              </Link>
                            </Flex>
                            {errors.invoiceNumber && (
                              <FormErrorMessage>
                                {errors.invoiceNumber}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                          <FormControl mb={4} isInvalid={!!errors.poNumber}>
                            <Flex alignItems="center">
                              <FormLabel width="150px" mb={0}>
                                P.O./S.O. Number
                              </FormLabel>
                              <Input
                                placeholder="Enter P.O./S.O. number"
                                flex="1"
                                fontSize="14px"
                                value={poNumber}
                              />
                            </Flex>
                            {errors.poNumber && (
                              <FormErrorMessage>
                                {errors.poNumber}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                          <FormControl
                            mb={4}
                            isInvalid={!!errors.invoiceDueDate}
                          >
                            <Flex alignItems="center">
                              <FormLabel width="150px" mb={0}>
                                Invoice Due
                              </FormLabel>
                              <Input
                                type="date"
                                fontSize="14px"
                                value={invoiceDueDate}
                                onChange={handleInvoiceDueDateChange}
                                flex="1"
                                py={2}
                              />
                            </Flex>
                            {errors.invoiceDueDate && (
                              <FormErrorMessage>
                                {errors.invoiceDueDate}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                          <FormControl mb={4}>
                            <Flex alignItems="center">
                              <FormLabel width="150px" mb={0}>
                                Payment Due
                              </FormLabel>
                              <Select
                                placeholder="Select payment term"
                                value={paymentTerm}
                                onChange={handlePaymentTermChange}
                                flex="1"
                                fontSize="14px"
                              >
                                <option value="net15">Net 15</option>
                                <option value="net30">Net 30</option>
                                <option value="net60">Net 60</option>
                                <option value="net90">Net 90</option>
                                <option value="custom">Custom Date</option>
                              </Select>
                              {paymentTerm === "custom" ? (
                                <Input
                                  type="date"
                                  value={customDate}
                                  onChange={handleCustomDateChange}
                                  flex="1"
                                  ml={2}
                                  fontSize="14px"
                                />
                              ) : (
                                <Input
                                  type="date"
                                  value={paymentDueDate}
                                  readOnly
                                  flex="1"
                                  ml={2}
                                  fontSize="14px"
                                />
                              )}
                            </Flex>
                            {errors.paymentDueDate && (
                              <FormErrorMessage>
                                {errors.paymentDueDate}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                        </Box>
                      </div>
                    </Flex>
                  </Box>
                  <Box width="full">
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={addItem}
                      colorScheme="blue"
                      variant="outline"
                      fontSize="13px"
                    >
                      Add an item
                    </Button>
                  </Box>

                  {items.length > 0 && (
                    <>
                      <Box
                        width="full"
                        p={6}
                        borderWidth={1}
                        borderRadius="md"
                        bg="white"
                      >
                        {/* <HStack spacing={4} width="full" mb="3"> */}
                        <HStack
                          spacing={6}
                          width="full"
                          mb={4}
                          align="center"
                          fontWeight="bold"
                        >
                          <Box flex="1" textAlign="center">
                            <FormLabel display="flex" justifyContent="center">
                              Service
                            </FormLabel>
                          </Box>
                          <Box flex="2" textAlign="center">
                            <FormLabel display="flex" justifyContent="center">
                              Description
                            </FormLabel>
                          </Box>
                          <Box flex="1" textAlign="center">
                            <FormLabel display="flex" justifyContent="center">
                              Unit
                            </FormLabel>
                          </Box>
                          <Box flex="1" textAlign="center">
                            <FormLabel display="flex" justifyContent="center">
                              Price
                            </FormLabel>
                          </Box>
                          <Box flex="1" textAlign="center">
                            <FormLabel display="flex" justifyContent="center">
                              Amount
                            </FormLabel>
                          </Box>
                          <Box flex="0.5"></Box>
                        </HStack>
                        {items.map((item, index) => (
                          <HStack
                            spacing={6}
                            width="full"
                            key={index}
                            mb="6"
                            align="center"
                          >
                            <Box flex="1">
                              <FormControl>
                                <Input
                                  placeholder="Enter service"
                                  value={item.service}
                                  onChange={(e) =>
                                    handleStringItemChange(
                                      index,
                                      "service",
                                      e.target.value
                                    )
                                  }
                                  fontSize="14px"
                                />
                              </FormControl>
                            </Box>
                            <Box flex="2">
                              <FormControl>
                                <Input
                                  placeholder="Enter description"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleStringItemChange(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  fontSize="14px"
                                />
                              </FormControl>
                            </Box>
                            <Box flex="1">
                              <FormControl>
                                <NumberInput
                                  value={item.unit}
                                  onChange={(valueString) =>
                                    handleNumberItemChange(
                                      index,
                                      "unit",
                                      valueString
                                    )
                                  }
                                >
                                  {" "}
                                  <NumberInputField fontSize="14px !important" />
                                </NumberInput>
                              </FormControl>
                            </Box>
                            <Box flex="1" display="flex" alignItems="center">
                              <FormControl>
                                <HStack spacing={0}>
                                  <Box
                                    px="2"
                                    display="flex"
                                    alignItems="center"
                                  >
                                    {currency}
                                  </Box>
                                  <NumberInput
                                    value={item.price}
                                    onChange={(valueString) =>
                                      handleNumberItemChange(
                                        index,
                                        "price",
                                        valueString
                                      )
                                    }
                                  >
                                    <NumberInputField fontSize="14px !important" />
                                  </NumberInput>
                                </HStack>
                              </FormControl>
                            </Box>
                            <Box flex="1" display="flex" alignItems="center">
                              <FormControl>
                                <HStack spacing={0}>
                                  <Box
                                    px="2"
                                    display="flex"
                                    alignItems="center"
                                  >
                                    {currency}
                                  </Box>
                                  <NumberInput value={item.amount} isReadOnly>
                                    <NumberInputField fontSize="14px !important" />
                                  </NumberInput>
                                </HStack>
                              </FormControl>
                            </Box>
                            <Box flex="0.5" textAlign="center">
                              <Button
                                colorScheme="red"
                                variant="outline"
                                onClick={() => removeItem(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Box>
                          </HStack>
                        ))}
                        {["Sub Total", "Discount", "Tax", "Total Amount"].map(
                          (label, idx) => {
                            let value = 0;
                            let isReadOnly = true;
                            let suffix: string | undefined;

                            switch (label) {
                              case "Sub Total":
                                value = parseFloat(subtotal.toFixed(2));
                                break;
                              case "Discount":
                                value = discount;
                                isReadOnly = false;
                                suffix = "%";
                                break;
                              case "Tax":
                                value = tax;
                                isReadOnly = false;
                                suffix = "%";
                                break;
                              case "Total Amount":
                                value = parseFloat(totalAmount.toFixed(2));
                                break;
                            }

                            return (
                              <HStack
                                spacing={6}
                                width="full"
                                key={idx}
                                mt={3}
                                align="center"
                              >
                                <Box flex="2"></Box>
                                <Box flex="1"></Box>
                                <Box flex="1"></Box>
                                <Box flex="1" textAlign="center">
                                  <FormLabel>{label}</FormLabel>
                                </Box>
                                <Box flex="1">
                                  <FormControl>
                                    <InputGroup>
                                      <NumberInput
                                        isReadOnly={isReadOnly}
                                        value={value}
                                        precision={2}
                                        step={0.01}
                                        onChange={(valueString: string) => {
                                          const numericValue =
                                            parseFloat(valueString);
                                          if (label === "Discount") {
                                            setDiscount(numericValue);
                                          } else if (label === "Tax") {
                                            setTax(numericValue);
                                          }
                                        }}
                                      >
                                        <NumberInputField fontSize="14px" />
                                        {suffix && (
                                          <InputRightElement>
                                            <Text fontSize="14px">
                                              {suffix}
                                            </Text>
                                          </InputRightElement>
                                        )}
                                      </NumberInput>
                                    </InputGroup>
                                  </FormControl>
                                </Box>
                                <Box flex="0.5"></Box>
                              </HStack>
                            );
                          }
                        )}
                      </Box>
                    </>
                  )}
                  {errors.items && (
                    <FormErrorMessage>{errors.items}</FormErrorMessage>
                  )}
                  <Box width="full">
                    <FormLabel mb={2}>Notes / Terms</FormLabel>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Switch
                        size="sm"
                        isChecked={useRichText}
                        onChange={handleSwitchChange}
                      />
                      <FormLabel fontSize="14px" margin="0 10px">
                        Use Rich Text Editor
                      </FormLabel>
                    </Box>
                    {useRichText ? (
                      <ReactQuill
                        value={notes}
                        onChange={handleNotesChange}
                        placeholder="Enter notes or terms of service"
                        style={{ fontSize: "13px", height: "140px" }}
                      />
                    ) : (
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter notes or terms of service"
                        style={{ fontSize: "13px" }}
                      />
                    )}
                  </Box>
                  {/* <Box
                      width="full"
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      boxShadow="sm"
                      bg="gray.50"
                    >
                      <FormControl mb={4}>
                        <Flex alignItems="center">
                          <FormLabel width="150px" mb={0}>
                            Attach Files
                          </FormLabel>
                          <Input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            flex="1"
                            fontSize="14px"
                            padding="5px"
                          />
                        </Flex>
                        {uploadedFiles.length > 0 && (
                          <Box mt={2}>
                            <Text fontWeight="bold">Selected Files:</Text>
                            <ul>
                              {uploadedFiles.map((file, index) => (
                                <Flex key={index} alignItems="center" mt={2}>
                                  <Text fontSize="14px" mr={2}>
                                    {isEditMode ? (
                                      <a
                                        href={file.attachmentContent}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {file.attachmentName}
                                      </a>
                                    ) : (
                                      <>
                                        file.attachmentName
                                        <Button
                                          size="xs"
                                          onClick={() => handlePreview(file)}
                                          mr={2}
                                        >
                                          Preview
                                        </Button>
                                      </>
                                    )}
                                  </Text>
                                  <Button
                                    size="xs"
                                    colorScheme="red"
                                    onClick={() => handleRemove(index)}
                                  >
                                    Remove
                                  </Button>
                                </Flex>
                              ))}
                            </ul>
                          </Box>
                        )}
                      </FormControl>
                    </Box> */}
                  <Box
                    width="full"
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="sm"
                    bg="gray.50"
                  >
                    <FormControl mb={4}>
                      <Flex alignItems="center">
                        <FormLabel width="150px" mb={0}>
                          Attach Files
                        </FormLabel>
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          flex="1"
                          fontSize="14px"
                          padding="5px"
                        />
                      </Flex>
                      {uploadedFiles.length > 0 && !isEditInvoice && (
                        <Box mt={2}>
                          <Text fontWeight="bold">Selected Files:</Text>
                          <ul>
                            {uploadedFiles.map((file, index) => (
                              <Flex key={index} alignItems="center" mt={2}>
                                <Text fontSize="14px" mr={2}>
                                  {file.name}
                                </Text>
                                <Button
                                  size="xs"
                                  onClick={() => handlePreview(file)}
                                  mr={2}
                                >
                                  Preview
                                </Button>
                                <Button
                                  size="xs"
                                  colorScheme="red"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </Button>
                              </Flex>
                            ))}
                          </ul>
                        </Box>
                      )}
                      {isEditInvoice && invoiceAttachments.length > 0 && (
                        <Box mt={2}>
                          <Text fontWeight="bold" fontSize="14">
                            Attachments:
                          </Text>
                          <ul>
                            {invoiceAttachments.map((attachment, index) => (
                              <Flex key={index} alignItems="center" mt={2}>
                                <Text fontSize="14px" mr={2}>
                                  <Link
                                    href={attachment.attachmentContent}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="blue.500"
                                    _hover={{
                                      textDecoration: "underline",
                                      color: "blue.700",
                                    }}
                                  >
                                    {attachment.attachmentName}
                                  </Link>
                                </Text>
                                <Button
                                  size="xs"
                                  colorScheme="red"
                                  onClick={() => handleRemoveAttachment(index)}
                                >
                                  Remove
                                </Button>
                              </Flex>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </FormControl>
                  </Box>
                  <Box width="full">
                    <Button
                      colorScheme="blue"
                      width="full"
                      fontSize="14px"
                      onClick={handleSaveInvoice}
                    >
                      <Text>{id ? "Update Invoice" : "Save and Continue"}</Text>
                    </Button>
                  </Box>
                </VStack>
                <CustomerModal
                  isOpen={modalVisible}
                  onClose={closeModal}
                  onCustomerSelect={handleCustomerSelect}
                  selectedCustomerId={selectedCustomerId}
                  fetchCustomers={fetchCustomers}
                  customers={customers}
                  onNewCustomerCreated={updateCustomersList}
                  customerToEdit={isEditMode ? selectedCustomer : null}
                  isEditMode={isEditMode}
                />
                {id ? (
                  <PaymentSummaryModal
                    isOpen={isOpen}
                    onClose={onClose}
                    amountToBePaid={totalAmount.toString()}
                  />
                ) : (
                  <></>
                )}
              </Box>
            </>
          )}
        </div>
      </Layout>
    </Flex>
  );
};

export default AddInvoice;
