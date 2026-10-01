// Placeholder for whichever page matches the current URL
import { Outlet } from 'react-router-dom'

// Our navbar/header component
import Header from '../components/Header'

import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      {/* Shows on every page that uses this Layout */}
      <Header />

      {/* Swaps in the current page's content here */}
      <Outlet />

      <Footer />
    </>
  )
}

export default Layout