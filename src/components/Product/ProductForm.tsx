import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Switch,
  Textarea,
  SimpleGrid,
  useToast,
  FormErrorMessage,
  Center,
  Box,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Product_App_Base_URL, ImageUpload_URL } from "../../constant";
import { useState } from "react";

// Define validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  sku: yup.string().required("SKU is required"),
  price: yup
    .number()
    .transform((value, originalValue) =>
      typeof originalValue === "string" && originalValue.trim() === ""
        ? undefined
        : value
    )
    .positive("Price must be greater than zero")
    .required("Price is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  stockQuantity: yup
    .number()
    .transform((value, originalValue) =>
      typeof originalValue === "string" && originalValue.trim() === ""
        ? undefined
        : value
    )
    .min(0, "Stock quantity cannot be negative")
    .required("Stock quantity is required"),
  weight: yup
    .number()
    .transform((value, originalValue) =>
      typeof originalValue === "string" && originalValue.trim() === ""
        ? undefined
        : value
    )
    .positive("Weight must be greater than zero")
    .required("Weight is required"),
  dimensions: yup.string().required("Dimensions are required"),
  manufacturer: yup.string(),
  rating: yup
    .number()
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot be more than 5")
    .transform((value, originalValue) =>
      typeof originalValue === "string" && originalValue.trim() === ""
        ? undefined
        : value
    )
    .required("Rating is required"),
  isInStore: yup.boolean().default(false),
  isFeatured: yup.boolean().default(false),
});

// Define TypeScript type for form data
type ProductFormData = {
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stockQuantity: number;
  weight: number;
  dimensions: string;
  manufacturer?: string;
  rating: number;
  isInStore: boolean;
  isFeatured: boolean;
};

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  fetchProducts: () => void;
};

const ProductForm = ({ isOpen, onClose, fetchProducts }: ProductFormProps) => {
  const toast = useToast();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Initialize useForm with validation schema and default values
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      sku: "",
      category: "",
      stockQuantity: 0,
      weight: 0,
      dimensions: "",
      manufacturer: "",
      rating: 0,
      isInStore: false,
      isFeatured: false,
    },
    resolver: yupResolver(schema),
  });

  const onSave = async (data: ProductFormData) => {
    if (!selectedImageFile) {
      setImageError("Product image is required");
      return;
    }
    setImageError(null);
    setIsLoading(true);
    try {
      let imageUrl = "";
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("file", selectedImageFile);

        const imageUploadResponse = await axios.post(
          `${ImageUpload_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = imageUploadResponse.data.url;
      }

      // Add image URL to the product data
      const productData = { ...data, imageUrl };
      // Create product
      await axios.post(Product_App_Base_URL, productData);
      onClose();
      fetchProducts();
      toast({
        title: "Product Added",
        description: "New Product Added Successfully",
        status: "success",
        position: "top-right",
        isClosable: true,
        duration: 2000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to add product.",
        status: "error",
        isClosable: true,
        duration: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add/Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Box
              position="fixed"
              top={0}
              left={0}
              width="100%"
              height="100%"
              // bgColor="rgba(0, 0, 0, 0.5)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={9999} // Ensure it appears on top
            >
              <img src="/assets/spinner.gif" alt="Loading..." />
            </Box>
          )}

          <SimpleGrid columns={3} spacing={4}>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel>Product Name</FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter product name" {...field} />
                )}
              />
              {errors.name && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.name?.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.sku}>
              <FormLabel>SKU</FormLabel>
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter product SKU" {...field} />
                )}
              />
              {errors.sku && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.sku.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.price}>
              <FormLabel>Price</FormLabel>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <NumberInput {...field} min={0} precision={2} step={0.01}>
                    <NumberInputField
                      placeholder="Enter product price"
                      {...field}
                    />
                  </NumberInput>
                )}
              />
              {errors.price && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.price.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                  />
                )}
              />
              {errors.description && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.description.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.category}>
              <FormLabel>Category</FormLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter product category" {...field} />
                )}
              />
              {errors.category && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.category.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.stockQuantity}>
              <FormLabel>Stock Quantity</FormLabel>
              <Controller
                name="stockQuantity"
                control={control}
                render={({ field }) => (
                  <NumberInput {...field} min={0}>
                    <NumberInputField
                      placeholder="Enter stock quantity"
                      {...field}
                    />
                  </NumberInput>
                )}
              />
              {errors.stockQuantity && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.stockQuantity.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!selectedImageFile && !!imageError}>
              <FormLabel>Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                style={{ padding: "5px" }}
                onChange={(e) =>
                  setSelectedImageFile(
                    e.target.files ? e.target.files[0] : null
                  )
                }
              />
              {!selectedImageFile && imageError && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {imageError}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.weight}>
              <FormLabel>Weight</FormLabel>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <NumberInput {...field} min={0} precision={2} step={0.01}>
                    <NumberInputField
                      placeholder="Enter product weight"
                      {...field}
                    />
                  </NumberInput>
                )}
              />
              {errors.weight && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.weight.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.dimensions}>
              <FormLabel>Dimensions</FormLabel>
              <Controller
                name="dimensions"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter product dimensions" {...field} />
                )}
              />
              {errors.dimensions && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.dimensions.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Manufacturer(Optional)</FormLabel>
              <Controller
                name="manufacturer"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter manufacturer name" {...field} />
                )}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.rating}>
              <FormLabel>Rating</FormLabel>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    min={0}
                    max={5}
                    precision={1}
                    step={0.1}
                  >
                    <NumberInputField
                      placeholder="Enter product rating"
                      {...field}
                    />
                  </NumberInput>
                )}
              />
              {errors.rating && (
                <FormErrorMessage style={{ color: "red", fontSize: "18px" }}>
                  {errors.rating.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </SimpleGrid>

          <FormControl mt={4}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FormLabel mb="0">Is In Store</FormLabel>
              <Controller
                name="isInStore"
                control={control}
                render={({ field }) => (
                  <Switch isChecked={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </FormControl>
          <FormControl mt={4}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FormLabel mb="0">Is Featured</FormLabel>
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <Switch isChecked={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit(onSave)}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductForm;
