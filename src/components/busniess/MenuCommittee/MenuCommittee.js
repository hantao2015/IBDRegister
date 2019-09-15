import React, { Component } from "react";
import "./MenuCommittee.less";
import http from "../../../utils/api";
import { Tabs } from "antd";
import EditNotice from "../EditNotice";
import ApproveList from "../ApproveList";
import ApproveProjectList from "../ApproveProjectList";
import UploadFile from "../UploadFile/UploadFile";
const { TabPane } = Tabs;

class MenuCommittee extends Component {
  render() {
    return (
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "50px"
        }}
      >
        <TabPane tab="申请加入审批" key="1">
          <ApproveList></ApproveList>
        </TabPane>
        <TabPane tab="项目研究审核" key="2">
          <ApproveProjectList></ApproveProjectList>
        </TabPane>
        <TabPane tab="编辑发布通知" key="3">
          <EditNotice></EditNotice>
        </TabPane>
        <TabPane tab="上传资料" key="4">
          <UploadFile></UploadFile>
        </TabPane>
      </Tabs>
    );
  }
}

export default MenuCommittee;
