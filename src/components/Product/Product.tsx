import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  Avatar,
  Text,
  Badge,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Product_App_Base_URL } from "../../constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProductFormData } from "./types/ProductFormData";
import ProductForm from "./ProductForm";
import ProductSkeleton from "./ProductSkeleton";
const Product = () => {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    fetchProducts();
  }, [pageNumber, pageSize]);

  const fetchProducts = () => {
    setIsLoading(true);
    axios
      .get(`${Product_App_Base_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .then((response) => {
        setProducts(response.data.products);
        setTotalRecords(response.data.totalRecords);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1); // Reset to first page on page size change
  };

  if (isLoading) return <ProductSkeleton />;

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <Box shadow={"md"} rounded={"md"} m={32}>
      <Flex
        px="5"
        justifyContent={"space-between"}
        mb={5}
        alignItems={"center"}
      >
        <Heading fontSize={20}>Product List</Heading>
        <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={onOpen}>
          Add Product
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Is In Store</Th>
              <Th isNumeric>Price</Th>
              <Th>SKU</Th>
              <Th>Category</Th>
              <Th isNumeric>Stock Quantity</Th>
              <Th>Created Date</Th>
              <Th>Updated Date</Th>
              <Th isNumeric>Weight</Th>
              <Th>Dimensions</Th>
              <Th>Manufacturer</Th>
              <Th isNumeric>Rating</Th>
              <Th>Is Featured</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product: ProductFormData) => (
              <Tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={product.name} />
                    <Text>{product.name}</Text>
                  </HStack>
                </Td>
                <Td>{product.description}</Td>
                <Td>
                  <Badge>{product.isInStore ? "Yes" : "No"}</Badge>
                </Td>
                <Td>{product.price}</Td>
                <Td>{product.sku}</Td>
                <Td>{product.category}</Td>
                <Td>{product.stockQuantity}</Td>
                <Td>{new Date(product.createdDate).toLocaleDateString()}</Td>
                <Td>{new Date(product.updatedDate).toLocaleDateString()}</Td>
                <Td>{product.weight}</Td>
                <Td>{product.dimensions}</Td>
                <Td>{product.manufacturer}</Td>
                <Td>{product.rating}</Td>
                <Td>
                  <Badge>{product.isFeatured ? "Yes" : "No"}</Badge>
                </Td>
                <Td>
                  <HStack gap={3}>
                    <EditIcon boxSize={22} color={"blue"} />
                    <DeleteIcon boxSize={22} color={"red"} />
                    <ViewIcon boxSize={22} color={"green"} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {products.length === 0 && (
        <Heading textAlign={"center"} p="5" fontSize={14}>
          No Products Found
        </Heading>
      )}
      <Flex justifyContent="center" alignItems="center" mt={2} gap="16px">
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{ width: "80px" }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </Select>
        <HStack>
          <Button
            onClick={() => handlePageChange(pageNumber - 1)}
            isDisabled={pageNumber === 1}
            style={{ marginBottom: "10px" }}
          >
            Previous
          </Button>
          <Text style={{ marginBottom: "10px" }}>
            Page {pageNumber} of {totalPages}
          </Text>
          <Button
            onClick={() => handlePageChange(pageNumber + 1)}
            isDisabled={pageNumber === totalPages}
            style={{ marginBottom: "10px" }}
          >
            Next
          </Button>
        </HStack>
      </Flex>
      {isOpen && (
        <ProductForm
          isOpen={isOpen}
          fetchProducts={fetchProducts}
          onClose={onClose}
        />
      )}
    </Box>
  );
};

export default Product;
