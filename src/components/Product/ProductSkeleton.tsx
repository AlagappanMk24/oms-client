import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Badge,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";

const ProductSkeleton = () => {
  return (
    <Box shadow={"md"} rounded={"md"} m={32}>
      <Flex
        px="5"
        justifyContent={"space-between"}
        mb={5}
        alignItems={"center"}
      >
        <Heading>
          <Skeleton>Product List</Skeleton>
        </Heading>
        <Skeleton>
          <Button colorScheme="blue" leftIcon={<AddIcon />}>
            Add Product
          </Button>
        </Skeleton>
      </Flex>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>
                <Skeleton>Id</Skeleton>
              </Th>
              <Th>
                <Skeleton>Name</Skeleton>
              </Th>
              <Th>
                <Skeleton>Description</Skeleton>
              </Th>
              <Th>
                <Skeleton>Is In Store</Skeleton>
              </Th>
              <Th isNumeric>
                <Skeleton>Price</Skeleton>
              </Th>
              <Th>
                <Skeleton>Actions</Skeleton>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <Tr key={index}>
                <Td>
                  <Skeleton>01</Skeleton>
                </Td>
                <Td>
                  <HStack>
                    <SkeletonCircle>AD</SkeletonCircle>
                    <Skeleton>Product Name</Skeleton>
                  </HStack>
                </Td>
                <Td>
                  <Skeleton>Product description</Skeleton>
                </Td>
                <Td>
                  <Badge>
                    <Skeleton>Yes</Skeleton>
                  </Badge>
                </Td>
                <Td isNumeric>
                  <Skeleton>25.40</Skeleton>
                </Td>
                <Td>
                  <HStack>
                    <SkeletonCircle>1</SkeletonCircle>
                    <SkeletonCircle>1</SkeletonCircle>
                    <SkeletonCircle>1</SkeletonCircle>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductSkeleton;
