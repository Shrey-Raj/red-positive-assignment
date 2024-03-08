import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;
import UserForm from "./UserForm";
import UserTable from "./UserTable";

const items = [
  { key: 1, label: "Add User", sectionId: "addUser" },
  { key: 2, label: "View Users", sectionId: "viewUsers" },
];

const AppLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuSelect = ({ key }) => {
    // Find the corresponding sectionId based on the selected key
    const selectedItem = items.find(item => item.key === parseInt(key));
    if (selectedItem) {
      const section = document.getElementById(selectedItem.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Layout>
      {/* Header Starts  */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items.map(item => ({ ...item, key: String(item.key) }))}
          onSelect={handleMenuSelect}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>

      {/* Main Content */}
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          className="mt-4 mb-4"
          items={[{ title: "Home" }, { title: "Users" }]}
        />

        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <UserForm />
        </div>
        <UserTable />
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Full Stack Assignment ©{new Date().getFullYear()} Created by Shrey Raj
      </Footer>
    </Layout>
  );
};
export default AppLayout;
