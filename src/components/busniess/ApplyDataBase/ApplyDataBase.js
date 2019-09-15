import React, { Component } from "react";
import "./ApplyDataBase.less";
import {
  Collapse,
  Icon,
  Input,
  Upload,
  Button,
  Form,
  Checkbox,
  List,
  Skeleton,
  Avatar,
  message,
  Popconfirm,
  Spin
} from "antd";

class ApplyDataBase extends Component {
  state = {
    imageUrl: "",
    applyList: [],
    page: "listPage",
    record: {},
    loading: false
  };
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {
  };
  render() {
    const prop = this.props;
    const {  loading  } = this.state;
   

    return (
      <div className="applyDataBase">
        <div className="applyDataBase-btns">
          <Button
            icon={
              prop.page === "applyPage" ||
              prop.page === "checkPage" ||
              prop.page === "schedulePage"
                ? "rollback"
                : "plus"
            }
            type="primary"
            onClick={
              prop.page === "applyPage" ||
              prop.page === "checkPage" ||
              prop.page === "schedulePage"
                ? this.props.onBack
                : this.props.onApply
            }
            className="applyDataBase-btn"
          >
            {prop.page === "applyPage" ||
            prop.page === "checkPage" ||
            prop.page === "schedulePage"
              ? "返回"
              : prop.addText || "申请"}
          </Button>
          <a
            className="applyDataBase-photoBtn"
            type="link"
            onClick={
              prop.page === "showImagePage"
                ? this.props.onBack
                : this.props.showImage
            }
          >
            {prop.isShowImage
              ? ""
              : prop.page === "showImagePage"
              ? "返回"
              : prop.page === "listPage"
              ? "申请流程图"
              : ""}
          </a>
        </div>
        <Spin spinning={loading}>
          <div className="applyDataBase-content">
            {(() => {
              switch (prop.page) {
                case "listPage":
                  return prop.pages.listPage;
                case "applyPage":
                  return prop.pages.applyPage;
                case "checkPage":
                  return prop.pages.checkPage;
                case "showImagePage":
                  return prop.pages.showImagePage;
                case "schedulePage":
                  return prop.pages.schedulePage;
              }
            })()}
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(ApplyDataBase);
