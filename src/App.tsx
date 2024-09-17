import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Product from "./components/Product/Product";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import AddInvoice from "./components/Invoice/components/AddInvoice";
import InvoiceGrid from "./components/Invoice/components/InvoiceGrid";
import ViewInvoice from "./components/Invoice/components/ViewInvoice";
import Service from "./components/Service/Service";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";

const theme = extendTheme({
  components: {
    FormLabel: {
      baseStyle: {
        mb: 1,
        fontSize: "sm",
      },
    },
  },
});

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/services" element={<Service />} />
            <Route path="/invoices" element={<InvoiceGrid />} />
            <Route path="/invoices/create" element={<AddInvoice />} />
            <Route path="/invoices/edit/:id" element={<AddInvoice />} />{" "}
            {/* Edit route */}
            <Route path="/invoices/view/:id" element={<ViewInvoice />} />{" "}
            {/* Edit route */}
            <Route path="/product" element={<Product />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}

export default App;
