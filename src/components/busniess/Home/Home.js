import React, { Component } from "react";
import "./Home.less";
import {
  Menu,
  Icon,
  Button,
  Tabs,
  Upload,
  Popover,
  Alert,
  Form,
  Modal,
  Input,
  message,
  Spin
} from "antd";
import logo from "../../../assets/images/logo.png";
import NoticeList from "../NoticeList";
import ApplyDataBase from "../ApplyDataBase";
import ApplyProject from "../ApplyProject";
import ActApply from "../ActApply";
import MenuDataBase from "../MenuDataBase/MenuDataBase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MenuCommittee from "../MenuCommittee";
import http from "../../../utils/api";
const { TabPane } = Tabs;
const doctorInfoId = "622204211916";
const managerInfoId = '623858273868'
class Home extends Component {
  state = {
    collapsed: false,
    imageUrl: "",
    userInfo: {},
    currentItem: 1,
    visible: false,
    doctorInfo: {},
    isManager:false, //是否是数位会成员
    managerInfo:[],
    loading:false
  };
  constructor(props) {
    super(props);
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  //获取数委会名单
  getManagerInfo = async(userInfo) => {
    let res;
    try {
      res = await http().getTable({
        resid: managerInfoId,
      });
      if (res.data.error === 0) {
      res.data.data.map((item) => {
       if( item.phone === userInfo.UserInfo.EMP_HANDPHONE){
         localStorage.setItem("isManager",JSON.stringify(true))
         this.setState({
           isManager:true
         })
       }
      })
        this.setState({
          managerInfo: res.data.data[0]
        });
      }
    } catch (error) {
      message.error(error.message);
    }
  }
  getDoctorInfo = async(userInfo) => {
    let res;
    try {
      res = await http().getTable({
        resid: doctorInfoId,
        cmswhere: `phoneNumber = ${userInfo.UserInfo.EMP_HANDPHONE}`
      });
      if (res.data.error === 0) {
        localStorage.setItem("doctorInfo",JSON.stringify(res.data.data[0]))
        this.setState({
          doctorInfo: res.data.data[0]
        });
      }
    } catch (error) {
      message.error(error.message);
    }
  }
  componentDidMount = async () => {
    this.setState({
      loading:true
    })
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentItem = JSON.parse(localStorage.getItem("currentItem"));
    const isManager = JSON.parse(localStorage.getItem("isManager"));
    if (currentItem) {
      this.setState({
        userInfo,
        currentItem
      });
    } else {
      this.setState({
        userInfo
      });
    }
    if(!isManager){
      await this.getManagerInfo(userInfo);
    }else{
      this.setState({
        isManager:true
      })
    }
    await this.getDoctorInfo(userInfo);
     this.setState({
       loading:false
     })
  };
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  //修改个人信息
  onEditInfo = async () => {
    this.setState({
      visible: true
    });
  };
  onSave = () => {
    const { form } = this.props;
    let res;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let data = [
        {
          occupationNumber: form.getFieldValue("postNumber"), //执业证号码
          hospital: form.getFieldValue("hospital"), // 医院
          doctor: form.getFieldValue("doctor"),
          post: form.getFieldValue("post"),
          emial: form.getFieldValue("emial"),
          REC_ID: this.state.doctorInfo.REC_ID
        }
      ];
      try {
        res = await http().modifyRecords({
          resid: doctorInfoId,
          data
        });
        if (res.data.Error === 0) {
          message.success("修改成功");
          this.setState({
          doctorInfo: res.data.data[0]
          })
        }
      } catch (error) {
        message.error(error.message);
      }
      this.setState({
        visible: false
      });
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  //退出
  logout = () => {
    console.log("logout", this.props);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentItem");
    this.props.history.replace({
      pathname: "/"
    });
  };
  //切换路由
  onMenuDetail = name => {
    if (name === "menuCommittee") {
      localStorage.setItem("currentItem", 2);
      this.setState({
        currentItem: 2
      });
    } else {
      localStorage.setItem("currentItem", 1);
      this.setState({
        currentItem: 1
      });
    }
    this.props.history.push({
      pathname: `/${name}`
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { doctorInfo } = this.state;
    const uploadButton = (
      <div>
        <div className="ant-upload-text">请上传照片</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const content = (
      <React.Fragment>
        <div
          style={{
            margin: "10px 0 ",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Button
            type="primary"
            icon="edit"
            size="small"
            onClick={this.onEditInfo}
          >
            修改信息
          </Button>
          <Button
            type="primary"
            icon="logout"
            size="small"
            onClick={this.logout}
            style={{ marginTop: "10px" }}
          >
            退出登录
          </Button>
        </div>
      </React.Fragment>
    );
    const { imageUrl, userInfo, currentItem,isManager ,loading} = this.state;
    return (
      <Spin spinning={loading}>
      <div className="home">
        <Modal
          title="修改个人信息"
          visible={this.state.visible}
          width={600}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                this.onSave();
              }}
            >
              保存
            </Button>
          ]}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit} className="home-modal">
            <Form.Item label="姓名">
              {getFieldDecorator("doctor", {
                rules: [{ required: true, message: "请输入您的姓名!" }],
                initialValue: doctorInfo.doctor
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="姓名"
                />
              )}
            </Form.Item>
            <Form.Item label="医院">
              {getFieldDecorator("hospital", {
                rules: [{ required: true, message: "请输入您所在的医院!" }],
                initialValue: doctorInfo.hospital
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="医院"
                />
              )}
            </Form.Item>
            <Form.Item label='职称'>
              {getFieldDecorator("post", {
                rules: [{ required: true, message: "请输入您的职称!" }],
                initialValue: doctorInfo.post
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="职称"
                />
              )}
            </Form.Item>
            <Form.Item label='执业证号码'>
              {getFieldDecorator("postNumber", {
                rules: [{ required: true, message: "请输入您的执业证号码!" }],
                initialValue: doctorInfo.occupationNumber
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="执业证号码"
                />
              )}
            </Form.Item>
            <Form.Item label='邮箱'>
              {getFieldDecorator("email", {
                rules: [{ required: true, message: "请输入您的邮箱!" }],
                initialValue: doctorInfo.email
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="邮箱"
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
        <div className="home-left">
          <Menu
            selectedKeys={[`${currentItem}`]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            style={{ height: "100vh" }}
            inlineCollapsed={this.state.collapsed}
          >
            <div className="home-left-logo">
              <img className="home-left-logo-img" src={logo}></img>
            </div>
            <Menu.Item
              key="1"
              onClick={() => {
                this.onMenuDetail("home");
              }}
            >
              <Icon type="pie-chart" />
              <span>CHASE-IBD数据库</span>
            </Menu.Item>
            {isManager? <Menu.Item
              key="2"
              onClick={() => {
                this.onMenuDetail("menuCommittee");
              }}
            >
              <Icon type="desktop" />
              <span>数据库委员会</span>
            </Menu.Item>:null}
           
          </Menu>
        </div>
        <div className="home-right">
          <div className="home-right-top">
            <div className="home-right-top-tabs">
              <Route path="/home" component={MenuDataBase}></Route>
              <Route path="/menuCommittee" component={MenuCommittee}></Route>
            </div>

            <div className="home-right-top-user">
              {/* <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={this.handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload> */}
              <Popover content={content} placement="bottom">
                <div>
                  <Icon type="user" style={{ fontSize: "20px" }} />
                </div>
                <div>{doctorInfo.doctor}</div>
              </Popover>
            </div>
          </div>
          <div className="home-right-content">
            <div></div>
          </div>
        </div>
      </div></Spin>
    );
  }
}

export default Form.create()(Home);
