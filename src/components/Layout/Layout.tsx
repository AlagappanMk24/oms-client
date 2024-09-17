// import {
//     Box,
//     Flex,
//     Heading,
//     Text,
//     Stack,
//     Link,
//   } from '@chakra-ui/react';
//   import { useNavigate } from 'react-router-dom';

// const Layout = () => {
//     const navigate = useNavigate();
//   return (
//     <Flex>
//       {/* Sidebar */}
//       <Box w="250px" bg="green.500" color="white" p={6} minH="100vh">
//         <Flex direction="column" align="start">
//           <Heading size="md" mb={8}>
//          OMS
//           </Heading>
//           <Stack spacing={4}>
//             <Text cursor="pointer">Dashboard</Text>
//             <Text cursor="pointer">Customers</Text>
//             <Text cursor="pointer">Product</Text>
//             <Text cursor="pointer">Clients</Text>
//             <Text cursor="pointer">Services</Text>
//             {/* <Text cursor="pointer" fontWeight="bold">Invoice</Text> */}
//             <Text cursor="pointer" onClick={() => navigate('/invoices')}>
//               Invoice
//             </Text>
//             <Text cursor="pointer">Settings</Text>
//             <Text cursor="pointer" mt={8}>
//               Logout
//             </Text>
//           </Stack>
//         </Flex>
//       </Box>
//     </Flex>
//   );
// };

// export default Layout;

// import {
//   Box,
//   Flex,
//   Heading,
//   Text,
//   Stack,
//   IconButton,
//   useDisclosure,
//   Drawer,
//   DrawerContent,
//   DrawerOverlay,
//   DrawerCloseButton,
//   DrawerBody,
//   DrawerHeader,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

// const Layout = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const navigate = useNavigate();

//   return (
//     <Flex direction="column" minH="100vh" width="100%">
//       {/* Top Navigation Bar */}
//       <Flex
//         as="nav"
//         bg="blue.600"
//         color="white"
//         align="center"
//         justify="space-between"
//         padding="1rem"
//         boxShadow="md"
//       >
//         <IconButton
//           aria-label="Open Menu"
//           icon={<FaBars />}
//           display={{ base: 'block', md: 'none' }}
//           onClick={onOpen}
//           variant="ghost"
//           colorScheme="whiteAlpha"
//         />
//         <Heading size="lg">OMS</Heading>
//         <Flex align="center">
//           <IconButton
//             aria-label="Notifications"
//             icon={<FaBell />}
//             variant="ghost"
//             colorScheme="whiteAlpha"
//             mr={4}
//           />
//           <IconButton
//             aria-label="Profile"
//             icon={<FaUserCircle />}
//             variant="ghost"
//             colorScheme="whiteAlpha"
//             mr={4}
//           />
//           <IconButton
//             aria-label="Logout"
//             icon={<FaSignOutAlt />}
//             variant="ghost"
//             colorScheme="whiteAlpha"
//             onClick={() => {
//               navigate('/');
//             }}
//           />
//         </Flex>
//       </Flex>

//       <Flex flex="1">
//         {/* Sidebar for larger screens */}
//         <Box
//           w="250px"
//           bg="blue.500"
//           color="white"
//           p={6}
//           minH="100vh"
//           display={{ base: 'none', md: 'block' }}
//         >
//           <Flex direction="column" align="start">
//             <Stack spacing={4}>
//               <Text cursor="pointer">Dashboard</Text>
//               <Text cursor="pointer">Customers</Text>
//               <Text cursor="pointer">Product</Text>
//               <Text cursor="pointer">Clients</Text>
//               <Text cursor="pointer">Services</Text>
//               <Text cursor="pointer" onClick={() => navigate('/invoices')}>
//                 Invoice
//               </Text>
//               <Text cursor="pointer">Settings</Text>
//               <Text cursor="pointer" mt={8}>
//                 Logout
//               </Text>
//             </Stack>
//           </Flex>
//         </Box>

//         {/* Drawer Sidebar for mobile screens */}
//         <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
//           <DrawerOverlay />
//           <DrawerContent bg="green.500" color="white">
//             <DrawerCloseButton />
//             <DrawerHeader borderBottomWidth="1px">OMS</DrawerHeader>
//             <DrawerBody>
//               <Stack spacing={4} mt={4}>
//                 <Text cursor="pointer" onClick={onClose}>
//                   Dashboard
//                 </Text>
//                 <Text cursor="pointer" onClick={onClose}>
//                   Customers
//                 </Text>
//                 <Text cursor="pointer" onClick={onClose}>
//                   Product
//                 </Text>
//                 <Text cursor="pointer" onClick={onClose}>
//                   Clients
//                 </Text>
//                 <Text cursor="pointer" onClick={onClose}>
//                   Services
//                 </Text>
//                 <Text
//                   cursor="pointer"
//                   onClick={() => {
//                     navigate('/invoices');
//                     onClose();
//                   }}
//                 >
//                   Invoice
//                 </Text>
//                 <Text cursor="pointer" onClick={onClose}>
//                   Settings
//                 </Text>
//                 <Text cursor="pointer" mt={8} onClick={onClose}>
//                   Logout
//                 </Text>
//               </Stack>
//             </DrawerBody>
//           </DrawerContent>
//         </Drawer>
//         <Box flex="1" p={8}>
//           <Text>Main content goes here.</Text>
//         </Box>
//       </Flex>
//     </Flex>
//   );
// };

// export default Layout;

// import React from 'react';
// import {
//   Box,
//   Flex,
//   Heading,
//   IconButton,
//   Stack,
//   Text,
//   useDisclosure,
//   Drawer,
//   DrawerContent,
//   DrawerOverlay,
//   DrawerCloseButton,
//   DrawerBody,
//   DrawerHeader,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const navigate = useNavigate();

//   return (
//     <Flex direction="column" minH="100vh" width="100%">
//       {/* Top Navigation Bar */}
//       <Flex
//         as="nav"
//         bg="blue.600"
//         color="white"
//         align="center"
//         justify="space-between"
//         padding="1rem"
//         boxShadow="md"
//       >
//         <IconButton
//           aria-label="Open Menu"
//           icon={<FaBars />}
//           display={{ base: 'block', md: 'none' }}
//           onClick={onOpen}
//           variant="ghost"
//           colorScheme="whiteAlpha"
//         />
//         <Heading fontSize="20px">Order Management</Heading>
//         <Flex align="center">
//           <IconButton
//             aria-label="Notifications"
//             icon={<FaBell />}
//             variant="ghost"
//             colorScheme="whiteAlpha"
//             mr={4}
//           />
//           <IconButton
//             aria-label="Profile"
//             icon={<FaUserCircle />}
//             variant="ghost"
//             colorScheme="whiteAlpha"
//             mr={4}
//           />
//           <IconButton
//             aria-label="Logout"
//             icon={<FaSignOutAlt />}
//             variant="ghost"
//             colorScheme="whiteAlpha"
//             onClick={() => {
//               navigate('/');
//             }}
//           />
//         </Flex>
//       </Flex>

//       <Flex flex="1" direction="row">
//         {/* Sidebar for larger screens */}
//         <Box
//           w={{ base: 'full', md: '250px' }}
//           bg="blue.500"
//           color="white"
//           p={6}
//           minH="100vh"
//           display={{ base: 'none', md: 'block' }}
//           position="relative"
//           zIndex="999"
//         >
//           <Flex direction="column" align="start" height="100%">
//             <Stack spacing={4}>
//               <Text cursor="pointer">Dashboard</Text>
//               <Text cursor="pointer">Customers</Text>
//               <Text cursor="pointer">Product</Text>
//               <Text cursor="pointer">Clients</Text>
//               <Text cursor="pointer" onClick={() => navigate('/services')}>Services</Text>
//               <Text cursor="pointer" onClick={() => navigate('/invoices')}>
//                 Invoicing
//               </Text>
//               <Text cursor="pointer">Settings</Text>
//               <Text cursor="pointer" mt={8}>
//                 Logout
//               </Text>
//             </Stack>
//           </Flex>
//         </Box>

//         {/* Drawer Sidebar for mobile screens */}
//         <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
//           <DrawerOverlay />
//           <DrawerContent bg="blue.500" color="white">
//             <DrawerCloseButton />
//             <DrawerHeader borderBottomWidth="1px">OMS</DrawerHeader>
//             <DrawerBody>
//               <Stack spacing={4} mt={4}>
//                 <Text cursor="pointer" onClick={() => navigate('/dashboard')}>
//                   Dashboard
//                 </Text>
//                 <Text cursor="pointer" onClick={() => navigate('/customers')}>
//                   Customers
//                 </Text>
//                 <Text cursor="pointer" onClick={() => navigate('/product')}>
//                   Product
//                 </Text>
//                 <Text cursor="pointer" onClick={() => navigate('/clients')}>
//                   Clients
//                 </Text>
//                 <Text cursor="pointer" onClick={() => navigate('/services')}>
//                   Services
//                 </Text>
//                 <Text cursor="pointer" onClick={() => navigate('/invoices')}>
//                   Invoice
//                 </Text>
//                 <Text cursor="pointer" onClick={() => navigate('/settings')}>
//                   Settings
//                 </Text>
//                 <Text cursor="pointer" mt={8} onClick={() => navigate('/')}>
//                   Logout
//                 </Text>
//               </Stack>
//             </DrawerBody>
//           </DrawerContent>
//         </Drawer>

//         {/* Main content area */}
//         <Box flex="1" p={8} ml={{ base: '0' }} bg="gray.50">
//           {children}
//         </Box>
//       </Flex>
//     </Flex>
//   );
// };

// export default Layout;

import React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaHandshake,
  FaFileInvoice,
  FaCog,
} from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Flex direction="column" minH="100vh" width="100%">
      {/* Top Navigation Bar */}
      <Flex
        as="nav"
        bg="blue.600"
        color="white"
        align="center"
        justify="space-between"
        padding="1rem"
        boxShadow="md"
      >
        <IconButton
          aria-label="Open Menu"
          icon={<FaBars />}
          onClick={onOpen}
          variant="ghost"
          colorScheme="whiteAlpha"
        />
        <Heading fontSize="20px">Order Management</Heading>
        <Flex align="center">
          <IconButton
            aria-label="Notifications"
            icon={<FaBell />}
            variant="ghost"
            colorScheme="whiteAlpha"
            mr={4}
          />
          <IconButton
            aria-label="Profile"
            icon={<FaUserCircle />}
            variant="ghost"
            colorScheme="whiteAlpha"
            mr={4}
          />
          <IconButton
            aria-label="Logout"
            icon={<FaSignOutAlt />}
            variant="ghost"
            colorScheme="whiteAlpha"
            onClick={() => {
              navigate('/');
            }}
          />
        </Flex>
      </Flex>

      <Flex flex="1" direction="row">
        {/* Drawer Sidebar for all screens */}
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg="blue.500" color="white">
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Order Management</DrawerHeader>
            <DrawerBody>
              <Stack spacing={4} mt={4}>
                <Flex align="center" cursor="pointer" onClick={() => { navigate('/dashboard'); onClose(); }}>
                  <Icon as={FaTachometerAlt} mr={2} />
                  <Text>Dashboard</Text>
                </Flex>
                <Flex align="center" cursor="pointer" onClick={() => { navigate('/customers'); onClose(); }}>
                  <Icon as={FaUsers} mr={2} />
                  <Text>Customers</Text>
                </Flex>
                <Flex align="center" cursor="pointer" onClick={() => { navigate('/product'); onClose(); }}>
                  <Icon as={FaBox} mr={2} />
                  <Text>Product</Text>
                </Flex>
                <Flex align="center" cursor="pointer" onClick={() => { navigate('/clients'); onClose(); }}>
                  <Icon as={FaHandshake} mr={2} />
                  <Text>Clients</Text>
                </Flex>
                <Flex align="center" cursor="pointer" onClick={() => { navigate('/services'); onClose(); }}>
                  <Icon as={FaCog} mr={2} />
                  <Text>Services</Text>
                </Flex>
                <Flex align="center" cursor="pointer" onClick={() => { navigate('/invoices'); onClose(); }}>
                  <Icon as={FaFileInvoice} mr={2} />
                  <Text>Invoicing</Text>
                </Flex>
                <Flex align="center" cursor="pointer" onClick={() => { navigate('/settings'); onClose(); }}>
                  <Icon as={FaCog} mr={2} />
                  <Text>Settings</Text>
                </Flex>
                <Flex align="center" mt={8} cursor="pointer" onClick={() => { navigate('/'); onClose(); }}>
                  <Icon as={FaSignOutAlt} mr={2} />
                  <Text>Logout</Text>
                </Flex>
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main content area */}
        <Box flex="1" p={8} bg="gray.50">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;

