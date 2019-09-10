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
import http from "../../../utils/api";
import ShowImage from "./ShowImage";
import applyDataBaseImage from "../../../assets/images/applyDataBase.jpg";
const applyDataBaseId = "620384838453";

const uploadFile = (file, url) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData();
    fd.append("file", file, file.name);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.onload = () => {
      const data = JSON.parse(xhr.response);
      if (xhr.status === 200 && (data.error === 0 || data.error === "0")) {
        const imgUrl = data.data;
        resolve(imgUrl);
      } else {
        reject(data);
      }
    };
    xhr.send(fd);
  });
};
class ApplyDataBase extends Component {
  state = {
    imageUrl: "",
    applyList: [],
    page: "listPage",
    record: {},
    loading: false
  };
  constructor(props){
    super(props)
  }
  componentDidMount = async () => {
    let res;

    await this.getApplyData();
  };
  //获取申请记录
  getApplyData = async () => {
    let res;
    this.setState({
      loading: true
    });
    try {
      res = await http().getTable({
        resid: applyDataBaseId
      });
      console.log("res.data.data", res.data.data);
      let data = [];

      res.data.data.map(item => {
        let studyType = item.studyType && item.studyType.split(",");
        item.studyType = studyType;
        data.push(item);
      });
      if (res.data.error == 0) {
        this.setState({
          applyList: data
        });
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      loading: false
    });
  };
  onApply = () => {
    this.setState({
      page: "applyPage"
    });
  };
  onBack = () => {
    this.setState({
      page: "listPage"
    });
  };
  onCheck = item => {
    this.setState({
      page: "checkPage",
      record: item
    });
  };
  showImage = () => {
    this.setState({
      page: "showImagePage"
    });
  };
  onChangeCheckbox = checkedValues => {
    // console.log("checkedValues", study);
  };
  handleSubmit = (e, type) => {
    // console.log("e",e,type)
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.onSubmit(values, type);
      }
    });
  };
  //提交列表中的一条记录
  onSubmitRecord = async record => {
    let res;
    record.isSubmit = "Y";
    try {
      res = await http().modifyRecords({
        resid: applyDataBaseId,
        data: [record]
      });
      if (res.data.Error == 0) {
        message.success("提交成功");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  //上传文件
  handleUploadFile = async fileInfo => {
    const file = fileInfo.file;
    const bucketname = "realsun";
    const type = "";
    const fileUrl = `http://ivf.realsun.me:9001/api/AliyunOss/PutOneImageObject?bucketname=${encodeURIComponent(
      bucketname
    )}&srctype=${encodeURIComponent(type)}`;
    try {
      await uploadFile(file, fileUrl).then(imageUrl => {
        this.setState({
          imageUrl
        });
      });
    } catch (err) {
      return message.error(err.message);
    }
  };
  //提交表单
  onSubmit = async (values, type) => {
    let res;
    let obj = {};
    let study = values.study && values.study.toString();
    if (type === 1) {
      obj = {
        doctor: values.doctor,
        hospital: values.hospital,
        post: values.post,
        phoneNumber: values.phone,
        email: values.email,
        teamPeople: values.teamPeople,
        teamPeople2: values.teamPeople2,
        teamPeople3: values.teamPeople3,
        studyType: values.study,
        CDPatientNumber: values.CDNumber,
        UCPatientNumber: values.UCNumber,
        doctorPhoto: this.state.imageUrl,
        studyType: study
      };
    } else {
      obj = {
        doctor: values.doctor,
        hospital: values.hospital,
        post: values.post,
        phoneNumber: values.phone,
        email: values.email,
        teamPeople: values.teamPeople,
        teamPeople2: values.teamPeople2,
        teamPeople3: values.teamPeople3,
        studyType: values.study,
        CDPatientNumber: values.CDNumber,
        UCPatientNumber: values.UCNumber,
        doctorPhoto: this.state.imageUrl,
        studyType: study,
        isSubmit: "Y"
      };
    }
    try {
      res = await http().addRecords({
        resid: applyDataBaseId,
        data: [obj]
      });
      if (res.data.Error == 0) {
        message.success("申请成功！");
      }
      this.setState({
        page: "listPage"
      });
      this.getApplyData();
    } catch (error) {
      message.error(error.message);
    }
  };
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  handleChange = info => {
    console.log("info", info);
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl
        })
      );
    }
  };

  renderPage = () => {
    let page = this.state.page;
    // switch(page){
    //   case 'applyPage':
    //     return (
    //       this.applyPage
    //     )
    //     case 'checkPage':
    //       return (
    //         applyPage
    //       )
    //       case 'listPage':
    //         return (
    //           listPage
    //         )
    // }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const prop = this.props;
    const { imageUrl, applyList, loading, page, record } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const options = [
      { label: "单中心研究", value: "单中心研究" },
      { label: "多中心研究", value: "多中心研究" },
      { label: "第三方研究", value: "第三方研究" },
      { label: "所有研究", value: "所有研究" }
    ];
    const showImagePage = <ShowImage image={applyDataBaseImage}></ShowImage>;
    const checkPage = (
      <Form
        {...formItemLayout}
        // onSubmit={this.handleSubmit}
        className="applyDataBase-form"
      >
        <h1>参与CHASE-IBD数据库建设申请表</h1>
        <h3>申请医疗单位</h3>
        <Form.Item label={<span>申请人&nbsp;</span>}>
          <span>{record.doctor}</span>
        </Form.Item>
        <Form.Item label={<span>所属单位&nbsp;</span>}>
          <span>{record.hospital}</span>
        </Form.Item>
        <Form.Item label={<span>职称&nbsp;</span>}>
          <span>{record.post}</span>
        </Form.Item>
        <Form.Item label={<span>联系电话&nbsp;</span>}>
          <span>{record.phoneNumber}</span>
        </Form.Item>
        <Form.Item label={<span>E-mail&nbsp;</span>}>
          <span>{record.email}</span>
        </Form.Item>
        <Form.Item label={<span>IBD治疗团队名单&nbsp;</span>}>
          <span>{record.teamPeople}</span>&nbsp;&nbsp;
          <span>{record.teamPeople2}</span>&nbsp;&nbsp;
          <span>{record.teamPeople3}</span>&nbsp;&nbsp;
        </Form.Item>
        <Form.Item label={<span>选择参与数据库研究&nbsp;</span>}>
          <Checkbox.Group
            options={options}
            defaultValue={record.studyType}
            onChange={this.onChangeCheckbox}
          />
        </Form.Item>
        <h3>贵院目前患者数量</h3>

        <Form.Item label={<span>CD患者数量&nbsp;</span>}>
          <span>{record.CDPatientNumber}</span>
        </Form.Item>
        <Form.Item label={<span>UC患者数量&nbsp;</span>}>
          <span>{record.UCPatientNumber}</span>
        </Form.Item>
        <Form.Item label={<span>医师执照&nbsp;</span>}>
          <img
            src={record.doctorPhoto}
            alt="avatar"
            style={{ backgroundSize: "100%" }}
          />
        </Form.Item>

        <Button
          icon="download"
          type="primary"
          className="applyDataBase-form-print"
        >
          打印
        </Button>
      </Form>
    );
    const listPage = (
      <List
        className="applyDataBase-content-list"
        itemLayout="horizontal"
        dataSource={applyList}
        renderItem={item => (
          <List.Item
            actions={[
              <a
                key="list-loadmore-edit"
                onClick={() => {
                  this.onCheck(item);
                }}
              >
                查看
              </a>,
              <Popconfirm
                title="你确定要提交吗"
                onConfirm={() => {
                  this.onSubmitRecord(item);
                }}
                okText="Yes"
                cancelText="No"
              >
                <a key="list-loadmore-edit">提交</a>
              </Popconfirm>
            ]}
          >
            {/* <Skeleton avatar title={false} loading={item.doctor} active> */}
            <List.Item.Meta
              // avatar={
              //   <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              // }
              title={
                <React.Fragment>
                  <a className="applyDataBase-content-list-word" href="#">
                    申请人:{item.doctor}
                  </a>
                  <a className="applyDataBase-content-list-word" href="#">
                    所属单位:{item.hospital}
                  </a>
                </React.Fragment>
              }
              description="草稿"
            />
            <div>申请日期：{item.REC_CRTTIME}</div>
            {/* </Skeleton> */}
          </List.Item>
        )}
      />
    );
    const applyPage = (
      <Form
        {...formItemLayout}
        // onSubmit={this.handleSubmit}
        className="applyDataBase-form"
      >
        <h1>参与CHASE-IBD数据库建设申请表</h1>
        <h3>申请医疗单位</h3>
        <Form.Item label={<span>申请人&nbsp;</span>}>
          {getFieldDecorator("doctor", {
            rules: [
              {
                required: true,
                message: "请输入申请人",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>所属单位&nbsp;</span>}>
          {getFieldDecorator("hospital", {
            rules: [
              {
                required: true,
                message: "请输入所属单位",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>职称&nbsp;</span>}>
          {getFieldDecorator("post", {
            rules: [
              {
                required: true,
                message: "请输入您的职称！",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>联系电话&nbsp;</span>}>
          {getFieldDecorator("phone", {
            rules: [
              {
                required: true,
                message: "请输入您的联系电话!",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>E-mail&nbsp;</span>}>
          {getFieldDecorator("email", {
            rules: [
              {
                required: true,
                message: "请输入您的邮箱!",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>IBD治疗团队名单&nbsp;</span>}>
          {getFieldDecorator("teamPeople")(<Input />)}
          {getFieldDecorator("teamPeople2", {})(<Input />)}
          {getFieldDecorator("teamPeople3", {})(<Input />)}
        </Form.Item>
        <Form.Item label={<span>选择参与数据库研究&nbsp;</span>}>
          {getFieldDecorator("study", {
            rules: []
          })(
            <Checkbox.Group
              options={options}
              onChange={this.onChangeCheckbox}
            />
          )}
        </Form.Item>
        <h3>贵院目前患者数量</h3>

        <Form.Item label={<span>CD患者数量：&nbsp;</span>}>
          {getFieldDecorator("CDNumber", {
            rules: [
              {
                required: true,
                message: "请输入贵院的CD患者数量!",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>UC患者数量：&nbsp;</span>}>
          {getFieldDecorator("UCNumber", {
            rules: [
              {
                required: true,
                message: "请输入贵院的UC患者数量!",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={<span>医师执照：&nbsp;</span>}>
          {getFieldDecorator("doctorPhoto", {})(
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={this.handleUploadFile}
              // fileList={fileList}
              onRemove={this.handleRemoveFile}
              onChange={this.handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          )}
        </Form.Item>
        <Button
          className="applyDataBase-form-save"
          htmlType="submit"
          onClick={() => {
            this.handleSubmit(this, 1);
          }}
        >
          保存
        </Button>
        <Button
          type="primary"
          className="applyDataBase-form-submit"
          htmlType="submit"
          onClick={() => {
            this.handleSubmit(this, 2);
          }}
        >
          提交
        </Button>
      </Form>
    );

    return (
      <div className="applyDataBase">
        <div className="applyDataBase-btns">
          <Button
            icon={
              prop.page === "applyPage" || prop.page === "checkPage" ? "rollback" : "plus"
            }
            type="primary"
            onClick={
              prop.page === "applyPage" || prop.page === "checkPage"
                ? this.props.onBack
                : this.props.onApply
            }
            className="applyDataBase-btn"
          >
            {prop.page === "applyPage" || prop.page === "checkPage" ? "返回" : prop.addText || "申请" }
          </Button>
          <a
            className="applyDataBase-photoBtn"
            type="link"
            onClick={prop.page === "showImagePage" ? this.props.onBack : this.props.showImage}
          >
            { prop.isShowImage ? '':  prop.page  === "showImagePage" ? "返回" : "申请流程图"}
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
              }
            })()}
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(ApplyDataBase);
