import React, { Component } from "react";
import "./ActApply.less";
import ApplyDataBase from "../ApplyDataBase";
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
  Spin,
  Tag,
  Modal,
  Steps,
  Popover
} from "antd";
import http from "../../../utils/api";
import ShowImage from "../ApplyDataBase/ShowImage";
import ReactToPrint from "react-to-print";
import applyDataBaseImage from "../../../assets/images/applyDataBase.jpg";
const applyDataBaseId = "620384838453";
const { Step } = Steps;

const customDot = (dot, { status, index }) => (
  <Popover content={<span>{status}</span>}>{dot}</Popover>
);

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
class ActApply extends Component {
  state = {
    imageUrl: "",
    applyList: [],
    page: "listPage",
    record: {},
    loading: false
  };
  componentDidMount() {
    this.getApplyData();
  }

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
      let data = [];
      res.data &&
        res.data.data &&
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

  handleSubmit = (e, type) => {
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
        await this.getApplyData();
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
  print = () => {
    var printBox = document.getElementById("applyDataBaseForm");
    //拿到打印的区域的html内容
    var newContent = printBox.innerHTML;
    //将旧的页面储存起来，当打印完成后返给给页面。
    var oldContent = document.body.innerHTML;
    //赋值给body
    document.body.innerHTML = newContent;
    //执行window.print打印功能
    window.print();
    // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
    window.location.reload();
    document.body.innerHTML = oldContent;
    return false;
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
    console.log("aaa");
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

  //查看进度
  onLookSchedule = record => {
    const modal = Modal.success({
      title: "进度查询",
      width: 500,
      content: (
        <div style={{ marginTop: "20px" }}>
          <Steps
            current={
              record.status === "通过" || record.status === "拒绝" ? 2 : 1
            }
            progressDot={customDot}
          >
            <Step title="提交报告" />
            <Step title="审核" />
            <Step title="完成" />
          </Steps>
          ,
        </div>
      )
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
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
    const pages = {
      showImagePage: <ShowImage image={applyDataBaseImage}></ShowImage>,
      checkPage: (
        <React.Fragment>
          <Form
            {...formItemLayout}
            // onSubmit={this.handleSubmit}
            className="applyDataBase-form"
            id="applyDataBaseForm"
          >
            <h1 style={{ textAlign: "center" }}>
              参与CHASE-IBD数据库建设申请表
            </h1>
            <h3 style={{ textAlign: "center" }}>申请医疗单位</h3>
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
            <h3 style={{ textAlign: "center" }}>贵院目前患者数量</h3>

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
                style={{ width: "200px", height: "200px" }}
              />
            </Form.Item>
          </Form>

          <Button
            icon="download"
            type="primary"
            className="applyDataBase-form-print"
            onClick={this.print}
          >
            打印
          </Button>
        </React.Fragment>
      ),
      listPage: (
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
                ,
                item.isSubmit === "Y" ? (
                  <a
                    key="list-loadmore-edit"
                    onClick={() => {
                      this.onLookSchedule(item);
                    }}
                  >
                    进度查询
                  </a>
                ) : (
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
                )
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
                description={
                  <Tag
                    color={
                      item.approveStatus === "通过"
                        ? "geekblue"
                        : item.approveStatus === "拒绝"
                        ? "red"
                        : "green"
                    }
                  >
                    {item.approveStatus}
                  </Tag>
                }
              />
              <div>申请日期：{item.REC_CRTTIME}</div>
              {/* </Skeleton> */}
            </List.Item>
          )}
        />
      ),
      applyPage: (
        <Form
          {...formItemLayout}
          // onSubmit={this.handleSubmit}
          className="applyDataBase-form"
        >
          <h1 style={{ textAlign: "center" }}>参与CHASE-IBD数据库建设申请表</h1>
          <h3 style={{ textAlign: "center" }}>申请医疗单位</h3>
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
          <h3 style={{ textAlign: "center" }}>贵院目前患者数量</h3>

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
      )
    };

    return (
      <ApplyDataBase
        pages={pages}
        page={this.state.page}
        onBack={this.onBack}
        showImage={this.showImage}
        onApply={this.onApply}
        ref={el => (this.componentRef = el)}
      ></ApplyDataBase>
    );
  }
}

export default Form.create()(ActApply);
