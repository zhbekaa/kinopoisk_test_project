import { Breadcrumb, Layout } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Logo } from "./components/Logo";
import { Content } from "antd/es/layout/layout";

const { Header, Footer } = Layout;

function App() {
  const location = useLocation();

  let currentLink = "";
  const breadCrumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `/${crumb}`;
      return {
        title: (
          <Link to={currentLink}>
            {crumb[0].toUpperCase() + crumb.substring(1)}
          </Link>
        ),
      };
    });
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header
        style={{
          zIndex: 1,
          width: "100%",
          padding: "0.1% 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "fit-content",
        }}
      >
        <Link to='/' style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Logo />
        </Link>
      </Header>
      <Content style={{ padding: "1% 1%", flex: 1 }}>
        <Breadcrumb items={breadCrumbs} />
        <Outlet />
      </Content>

      <Footer style={{ textAlign: "center", bottom: 0, marginTop: "auto" }}>
        ©{new Date().getFullYear()} Created by Bektursyn
      </Footer>
    </Layout>
  );
}

export default App;
