import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { App_Base_URL } from "../../../constant";
import { Flex } from "antd";
import { Customer, Address } from "../../Customer/CustomerType";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerSelect: (customer: Customer) => void;
  selectedCustomerId: number | null;
  fetchCustomers: () => void;
  customers: Customer[];
  onNewCustomerCreated: (newCustomer: Customer) => void;
  customerToEdit: Customer | null;
  isEditMode: boolean;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerSelect,
  selectedCustomerId,
  fetchCustomers,
  customers,
  onNewCustomerCreated,
  customerToEdit,
  isEditMode,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("existing");

  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(
    selectedCustomerId
  );

  useEffect(() => {
    if (customerToEdit) {
      setNewCustomer(customerToEdit);
    } else {
      setNewCustomer({
        id: 0, // This will be assigned by the server
        name: "",
        email: "",
        phoneNumber: "",
        address: {
          address1: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      });
    }
  }, [customerToEdit]);

  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    email: "",
    phoneNumber: "",
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof Customer | keyof Address, boolean>>
  >({});

  useEffect(() => {
    setSelectedCustomer(selectedCustomerId);
  }, [selectedCustomerId]);

  const handleCreateOrUpdateCustomer = async () => {
    const newValidationErrors: Partial<
      Record<keyof Customer | keyof Address, boolean>
    > = {};

    // Validation
    const requiredFields: (keyof Customer | keyof Address)[] = [
      "name",
      "email",
      "phoneNumber",
      "address1",
      "address2",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    requiredFields.forEach((field) => {
      if (field in newCustomer) {
        if (!newCustomer[field as keyof Customer]) {
          newValidationErrors[field] = true;
        }
      } else if (!newCustomer.address[field as keyof Address]) {
        newValidationErrors[field] = true;
      }
    });

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      if (newCustomer.id === 0) {
        // Create new customer
        const response = await axios.post(
          `${App_Base_URL}/Customer`,
          newCustomer
        );
        const createdCustomer = response.data;
        setSelectedCustomer(createdCustomer.id);
        onCustomerSelect(createdCustomer);
        onNewCustomerCreated(createdCustomer);
      } else {
        // Update existing customer
        const response = await axios.put(
          `${App_Base_URL}/Customer/${newCustomer.id}`,
          newCustomer
        );
        const updatedCustomer = response.data;
        onCustomerSelect(updatedCustomer);
        fetchCustomers();
      }
      onClose();
      setErrorMessage(""); // Clear error message
      setValidationErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleCustomerSelect = () => {
    if (selectedOption === "existing" && !selectedCustomer) {
      setErrorMessage("Please select a customer.");
    } else if (selectedCustomer !== null) {
      const customer = customers.find((c) => c.id === selectedCustomer);
      if (customer) {
        onCustomerSelect(customer);
        setErrorMessage("");
      }
    }
  };

  const handleClose = () => {
    setSelectedOption("existing");
    setErrorMessage("");
    onClose();
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomer(Number(e.target.value));
    setErrorMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Check if the input field belongs to the address object
    if (name in newCustomer.address) {
      setNewCustomer((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name as keyof Address]: value,
        },
      }));
    } else {
      setNewCustomer((prevState) => ({
        ...prevState,
        [name as keyof Customer]: value,
      }));
    }
    // Clear validation errors for the changed field
    if (validationErrors[name as keyof Customer]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    }
  };

  const isFieldInvalid = (field: keyof Customer | keyof Address) =>
    validationErrors[field];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader backgroundColor="lightblue" fontSize="18px">
          {isEditMode ? "Edit Customer" : "Select or Create Customer"}
        </ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody>
          {!isEditMode && (
            <FormControl mb={4}>
              <FormLabel mb={4}>Choose Option</FormLabel>
              <RadioGroup
                onChange={(value) => setSelectedOption(value)}
                value={selectedOption}
                display="flex"
                gap="20px"
              >
                <Radio value="existing">
                  <Text fontSize="15px">Choose Existing Customer</Text>
                </Radio>
                <Radio value="new">
                  <Text fontSize="14px">Create New Customer</Text>
                </Radio>
              </RadioGroup>
            </FormControl>
          )}
          {isEditMode || selectedOption === "new" ? (
            <FormControl padding="18px">
              <FormLabel
                display="flex"
                justifyContent="center"
                marginBottom="12px"
              >
                {isEditMode ? "" : "Create New Customer"}
              </FormLabel>
              {errorMessage && (
                <Text color="red.500" fontSize="14px" marginBottom="15px">
                  {errorMessage}
                </Text>
              )}
              <FormControl mb={2} isInvalid={isFieldInvalid("name")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    Name
                  </FormLabel>
                  <Input
                    name="name"
                    placeholder="Enter the name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("email")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    Email
                  </FormLabel>
                  <Input
                    name="email"
                    placeholder="Enter the email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("phoneNumber")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    Phone Number
                  </FormLabel>
                  <Input
                    name="phoneNumber"
                    placeholder="Enter the phone number"
                    value={newCustomer.phoneNumber}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("address1")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    Address 1
                  </FormLabel>
                  <Input
                    name="address1"
                    placeholder="Enter the address 1"
                    value={newCustomer?.address?.address1}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("address2")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    Address 2
                  </FormLabel>
                  <Input
                    name="address2"
                    placeholder="Enter the address 2"
                    value={newCustomer?.address?.address2}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("city")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    City
                  </FormLabel>
                  <Input
                    name="city"
                    placeholder="Enter the city"
                    value={newCustomer?.address?.city}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("state")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    State
                  </FormLabel>
                  <Input
                    name="state"
                    placeholder="Enter the state"
                    value={newCustomer?.address?.state}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("country")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    Country
                  </FormLabel>
                  <Input
                    name="country"
                    placeholder="Enter the country"
                    value={newCustomer?.address?.country}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
              <FormControl mb={2} isInvalid={isFieldInvalid("zipCode")}>
                <Flex>
                  <FormLabel width="150px" display="flex" alignItems="center">
                    Zip Code
                  </FormLabel>
                  <Input
                    name="zipCode"
                    placeholder="Enter the zip code"
                    value={newCustomer?.address?.zipCode}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>
            </FormControl>
          ) : selectedOption === "existing" ? (
            <FormControl mb={4}>
              <FormLabel>Select Existing Customer</FormLabel>
              <Select
                placeholder="Choose a customer"
                value={selectedCustomer || ""}
                onChange={handleCustomerChange}
                style={{ fontSize: "14px" }}
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
              {errorMessage && (
                <Text color="red.500" fontSize="14px">
                  {errorMessage}
                </Text>
              )}
            </FormControl>
          ) : null}
        </ModalBody>
        <ModalFooter>
          {isEditMode || selectedOption === "new" ? (
            <Button
              colorScheme="blue"
              variant="outline"
              borderColor="blue.500"
              color="blue.500"
              onClick={handleCreateOrUpdateCustomer}
              mr={3}
            >
              <Text fontSize="13px">
                {newCustomer.id === 0 ? "Save New Customer" : "Update Customer"}
              </Text>
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={handleCustomerSelect} mr={3}>
              <span style={{ fontSize: "13px" }}>Ok</span>
            </Button>
          )}
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomerModal;
