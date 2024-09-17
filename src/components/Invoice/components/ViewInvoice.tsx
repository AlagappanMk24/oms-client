import { useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Divider,
  Link,
  Icon,
  Button,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { InvoiceItem } from "../types/InvoiceType";
import Layout from "../../Layout/Layout";
import { App_Base_URL } from "../../../constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { Customer } from "../../Customer/CustomerType";
import { Location } from "../types/InvoiceType";
import { FiHome, FiMail, FiPhone } from "react-icons/fi";
import "../styles/Invoice.css";

const ViewInvoice = () => {
  const location = useLocation();
  const { invoice } = location.state;
  const [customer, setCustomer] = useState<Customer>();
  const [companyInfo, setCompanyInfo] = useState<Location>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  console.log(invoice, "Invoice");

  const invoiceId = invoice.id;

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await axios.get(
          `${App_Base_URL}/Location/${invoice.locationId}`
        );
        console.log(res, "res");
        setCompanyInfo(res.data);
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };
    fetchCompanyInfo();
  }, []);

  useEffect(() => {
    const getCustomerById = async () => {
      try {
        const res = await axios.get(
          `${App_Base_URL}/Customer/${invoice.customerId}`
        );
        setCustomer(res.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };
    getCustomerById();
  }, [invoice.customerId]);

  // const downloadInvoice = async () => {
  //   setLoading(true); // Set loading to true
  //   try {
  //     const input = document.getElementById("invoice-to-download");

  //     if (input) {
  //       const canvas = await html2canvas(input, {
  //         scale: 2,
  //         useCORS: true,
  //         ignoreElements: (element) => element.classList.contains("no-print"),
  //       });
  //       const data = canvas.toDataURL("image/png");

  //       const pdf = new jsPDF({
  //         orientation: "portrait",
  //         unit: "mm",
  //         format: "a4",
  //       });

  //       const imgWidth = 210;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       pdf.addImage(data, "PNG", 0, 0, imgWidth, imgHeight);

  //       const pdfBlob = pdf.output("blob");
  //       setPdfBlob(pdfBlob);

  //       pdf.save("invoice.pdf");
  //     }
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to download invoice.",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const downloadInvoice = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${App_Base_URL}/invoice/generate-pdf/${invoiceId}`,
        null, // No request body needed for GET
        { responseType: "blob" } // Ensure response is a blob
      );

      // Check if the response contains data
      if (response.data) {
        // Create a URL for the PDF Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf"); //
        document.body.appendChild(link);
        link.click();
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("No data received");
        toast({
          title: "Error",
          description: "Failed to download invoice.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download invoice.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          <Box
            id="invoice-to-download"
            p={[4, 6, 8]}
            bg="white"
            maxW="1000px"
            mx="auto"
            boxShadow="xl"
            borderRadius="lg"
          >
            {/* Header Section */}
            <Flex
              justify="space-between"
              align="center"
              mb={8}
              borderBottom="2px solid #E2E8F0"
              pb={4}
              flexDirection={["column", "row"]}
            >
              {companyInfo?.logo && (
                <Image
                  src={companyInfo?.logo || ""}
                  alt={companyInfo?.logo ? "Company Logo" : "No Logo Available"}
                  boxSize={companyInfo?.logo ? ["130px", "130px"] : undefined}
                  borderRadius={companyInfo?.logo ? "full" : undefined}
                  boxShadow={companyInfo?.logo ? "lg" : undefined}
                  border={companyInfo?.logo ? "2px solid" : undefined}
                  borderColor={companyInfo?.logo ? "gray.300" : undefined}
                />
              )}
              <Stack textAlign={["center", "right"]} mt={[4, 0]}>
                <Text
                  fontSize={["2xl", "3xl"]}
                  fontWeight="bold"
                  color="gray.700"
                >
                  INVOICE
                </Text>
                <Text
                  color="red.600"
                  fontSize={["xl", "2xl"]}
                  fontWeight="bold"
                >
                  Invoice Total: {companyInfo?.currency?.symbol}
                  {invoice.totalAmount.toFixed(2)}
                </Text>
                <Text fontSize={["md", "lg"]} color="gray.600">
                  Invoice Number: {invoice.invoiceNumber}
                </Text>
                <Text fontSize={["md", "lg"]} color="gray.600">
                  Date Of Issue:{" "}
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </Text>
              </Stack>
            </Flex>

            {/* Billing and Company Info */}
            <Flex
              justify="space-between"
              mb={8}
              bg="gray.50"
              p={4}
              borderRadius="md"
              flexDirection={["column", "row"]}
            >
              <Box mb={[4, 0]}>
                <Text fontWeight="bold" fontSize="lg" color="gray.700" mb={2}>
                  Billed To : {customer?.name}
                </Text>
                <Flex align="center" mb={2}>
                  <Icon as={FiMail} boxSize={5} color="gray.600" mr={3} />
                  <Text fontSize="md" color="gray.700">
                    {customer?.email}
                  </Text>
                </Flex>
                <Flex align="center" mb={2}>
                  <Icon as={FiPhone} boxSize={5} color="gray.600" mr={3} />
                  <Text fontSize="md" color="gray.700">
                    {customer?.phoneNumber}
                  </Text>
                </Flex>
                <Flex align="center" mb={2}>
                  <Icon as={FiHome} boxSize={5} color="gray.600" mr={3} />
                  <Text fontSize="md" color="gray.600">
                    {customer?.address?.address1}
                  </Text>
                </Flex>
                {customer?.address?.address2 && (
                  <Text fontSize="md" color="gray.600" ml={8}>
                    {customer?.address?.address2}
                  </Text>
                )}
                <Text fontSize="md" color="gray.600" ml={8}>
                  {customer?.address?.city}, {customer?.address?.state}
                </Text>
                <Text fontSize="md" color="gray.600" ml={8}>
                  {customer?.address?.country} - {customer?.address?.zipCode}
                </Text>
              </Box>
              {/* Company Info Section */}
              <Box borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold" fontSize="lg" color="gray.700" mb={4}>
                {companyInfo?.companyName}
                </Text>
                <Flex align="center" mb={2}>
                  <Icon as={FiMail} boxSize={5} color="gray.600" mr={3} />
                  <Text fontSize="md" color="gray.700">
                  {companyInfo?.email}
                  </Text>
                </Flex>
                <Flex align="center" mb={2}>
                  <Icon as={FiPhone} boxSize={5} color="gray.600" mr={3} />
                  <Text fontSize="md" color="gray.700">
                  {companyInfo?.phone}
                  </Text>
                </Flex>
                <Flex align="center" mb={2}>
                  <Icon as={FiHome} boxSize={5} color="gray.600" mr={3} />
                  <Text fontSize="md" color="gray.600">
                    {companyInfo?.address}
                  </Text>
                </Flex>
                <Text fontSize="md" color="gray.600">
                  {companyInfo?.city}, {companyInfo?.state}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {companyInfo?.country} - {companyInfo?.postalCode}
                </Text>
              </Box>
            </Flex>

            {/* Invoice Items Table */}
            <Box overflowX="auto" boxShadow="md" borderRadius="md">
              <Table variant="simple" colorScheme="gray" size="md">
                <Thead bg="gray.100">
                  <Tr>
                    <Th>Service</Th>
                    <Th>Description</Th>
                    <Th isNumeric>Unit</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {invoice.invoiceItems.map((item: InvoiceItem) => (
                    <Tr key={item.id} _hover={{ bg: "gray.50" }}>
                      <Td>{item.service}</Td>
                      <Td>{item.description}</Td>
                      <Td isNumeric>{item.unit}</Td>
                      <Td isNumeric>
                        {companyInfo?.currency?.symbol}
                        {item.price.toFixed(2)}
                      </Td>
                      <Td isNumeric>
                        {companyInfo?.currency?.symbol}
                        {item.amount.toFixed(2)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Total Calculation */}
            <Box mt={8} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
              <Flex justify="flex-end" mb={2}>
                <Box flex="3" display="flex" justifyContent="flex-end">
                  <Text fontSize="lg" fontWeight="bold">
                    Sub Total :
                  </Text>
                </Box>
                <Box flex="1" textAlign="right">
                  <Text fontSize="lg">
                    {companyInfo?.currency?.symbol}
                    {invoice.subtotal.toFixed(2)}
                  </Text>
                </Box>
              </Flex>
              <Flex justify="flex-end" mb={2}>
                <Box flex="3" display="flex" justifyContent="flex-end">
                  <Text fontSize="lg" fontWeight="bold">
                    Discount :
                  </Text>
                </Box>
                <Box flex="1" textAlign="right">
                  <Text fontSize="lg">
                    -{companyInfo?.currency?.symbol}
                    {invoice.discount.toFixed(2)}
                  </Text>
                </Box>
              </Flex>
              <Flex justify="flex-end" mb={2}>
                <Box flex="3" display="flex" justifyContent="flex-end">
                  <Text fontSize="lg" fontWeight="bold">
                    Tax :
                  </Text>
                </Box>
                <Box flex="1" textAlign="right">
                  <Text fontSize="lg">
                    {companyInfo?.currency?.symbol}
                    {invoice.tax.toFixed(2)}
                  </Text>
                </Box>
              </Flex>
              <Divider my={2} />
              <Flex justify="flex-end" mt={2}>
                <Box flex="3" display="flex" justifyContent="flex-end">
                  <Text fontSize="xl" fontWeight="bold" color="gray.700">
                    Total Amount :
                  </Text>
                </Box>
                <Box flex="1" textAlign="right">
                  <Text fontSize="xl" fontWeight="bold" color="gray.700">
                    {companyInfo?.currency?.symbol}
                    {invoice.totalAmount.toFixed(2)}
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Notes Section */}
            <Box mt={8} p={6} bg="gray.50" borderRadius="md" boxShadow="sm">
              <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={2}>
                Notes
              </Text>
              <Text fontSize="md" color="gray.600">
                {invoice.notes || "No additional notes provided."}
              </Text>
            </Box>

            {/* Payment Instruction */}
            <Box
              mt={8}
              p={6}
              bg="gray.100"
              borderRadius="md"
              className="no-print"
            >
              <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                HOW TO PAY:
              </Text>
              <Text fontSize="md" color="gray.600" mb={4}>
                Make payments through Bank Transfer:
              </Text>
              <Stack spacing={2}>
                <Text></Text>
                <Text>Account Name: {companyInfo?.companyName}</Text>
                <Text>Account Number: 1234567890</Text>
                <Text>Bank Name: XYZ Bank</Text>
                <Text>SWIFT Code: XYZ123</Text>
                <Text>Reference: Invoice Number</Text>
                <Text fontSize="md" color="gray.600">
                  PayPal Visit:{" "}
                  <Link
                    href="https://payid.com.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.500"
                  >
                    https://payid.com.au/
                  </Link>
                </Text>
                <Text color="red.600" mt={4} fontSize="lg" fontWeight="bold">
                  Please Send Proof of Payment To: admin@kltinfotech.com
                </Text>
              </Stack>
            </Box>

            <Flex mt={8} justify="center" align="center" className="no-print">
              <Button
                colorScheme="blue"
                onClick={downloadInvoice}
                isDisabled={loading} // Disable button while loading
              >
                {loading ? "Downloading..." : "Download PDF"}
              </Button>
            </Flex>
            {loading && (
              <Center mt={8} className="no-print">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  label="Downloading your invoice..."
                />
                <Text ml={3} fontSize="lg" color="blue.500">
                  Downloading your invoice...
                </Text>
              </Center>
            )}
          </Box>
        </div>
      </Layout>
    </>
  );
};

export default ViewInvoice;
