import React, { Component } from "react";
import "./UploadFile.less";
import {
  Icon,
  Input,
  Upload,
  Button,
  Form,
  message,
  Spin,
  Modal,
  Table,
  Divider,
  Popconfirm
} from "antd";
import http from "../../../utils/api";

const fileId = "621892190597";
const columns = props => {
  const { onDown, onDelete } = props;
  return [
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
      width: 250
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      width: 400
    },
    {
      title: "上传者",
      dataIndex: "uploadPerson",
      key: "uploadPerson",
      width: 150
    },
    {
      title: "上传时间",
      dataIndex: "uploadDate",
      key: "uploadDate",
      width: 150
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (text, record) => (
        <span>
          <a
            onClick={() => {
              onDown(record);
            }}
          >
            下载
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="你确定要提交吗"
            onConfirm={() => {
              onDelete(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      )
    }
  ];
};
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
class UploadFile extends Component {
  state = {
    spin: false,
    data: [],
    record: {},
    visible: false,
    fileUrl: ""
  };
  componentDidMount = async () => {
    await this.getData();
  };
  //获取文件表记录
  getData = async () => {
    let res;
    this.setState({
      spin: true
    });
    try {
      res = await http().getTable({
        resid: fileId
      });
      if (res.data.error == 0) {
        this.setState({
          data: res.data.data
        });
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      spin: false
    });
  };

  handleSubmit = e => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.onSubmit(values);
      }
    });
  };
  onDelete = async record => {
    let res;
    try {
      res = await http().removeRecords({
        resid: fileId,
        data: [record]
      });
      if (res.data.Error == 0) {
        message.success("操作成功");
      }
      this.setState({
        visible: false
      });
      this.getData();
    } catch (error) {
      message.error(error.message);
    }
  };
  //下载文件
  onDown = url => {
    if (!url) {
      return Modal.warning({
        title: "您还未上传过资料"
      });
    }
    const urls = url.split(";file;");
    for (let i = 0, len = urls.length; i < len; i++) {
      window.open(urls[i]);
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
      await uploadFile(file, fileUrl).then(fileUrl => {
        this.setState({
          fileUrl
        });
      });
    } catch (err) {
      return message.error(err.message);
    }
  };
  //提交表单
  onSubmit = async values => {
    let res;
    let obj = {};
    obj = {
      fileName: values.fileName,
      fileUrl: this.state.fileUrl,
      remark:values.remark
    };
    try {
      res = await http().addRecords({
        resid: fileId,
        data: [obj]
      });
      if (res.data.Error == 0) {
        message.success("操作成功");
      }
      this.setState({
        visible: false
      });
      this.getData();
    } catch (error) {
      message.error(error.message);
    }
  };
  onAdd = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, record, data, fileUrl } = this.state;
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

    return (
      <div className="editNotice">
        <Button type="primary" className="editNotice-add" onClick={this.onAdd}>
          上传新资料
        </Button>
        <Spin spinning={spin}>
          <Table
            key="3"
            className="editNotice-table"
            columns={columns({
              onDown: record => {
                this.onDown(record.fileUrl);
              },
              onDelete: record => {
                this.onDelete(record);
              },
              data: data
            })}
            scroll={{ x: 1000, y: "calc(100vh - 260px)" }}
            dataSource={data}
          />
          <Modal
            title="上传文件"
            visible={this.state.visible}
            width={700}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            destroyOnClose
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
            ]}
          >
            <Form {...formItemLayout} className="editNotice-form">
              <Form.Item
                className="editNotice-form-item"
                label={<span>资料名称&nbsp;</span>}
              >
                {getFieldDecorator("fileName", {
                  rules: [
                    {
                      required: true,
                      message: "请输入申请人",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>  
               <Form.Item
                className="editNotice-form-item"
                label={<span>备注&nbsp;</span>}
              >
                {getFieldDecorator("remark", {
                  rules: [
                    {
                      required: true,
                      message: "请输入备注",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item
                className="editNotice-form-item"
                label={<span>资料&nbsp;</span>}
              >
                {getFieldDecorator("file", {
                  rules: [
                    {
                      required: true,
                      message: "请输入申请人",
                      whitespace: true
                    }
                  ]
                })(
                  <div>
                    <Upload
                      name="file"
                      showUploadList={false}
                      customRequest={this.handleUploadFile}
                      onRemove={this.handleRemoveFile}
                      onChange={this.handleChange}
                    >
                      <Button>
                        <Icon type="upload" /> 上传
                      </Button>
                    </Upload>
                    <Input style={{ display: "none" }} value={fileUrl} />
                  </div>
                )}
                <div>
                  <a href={fileUrl}>{fileUrl}</a>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(UploadFile);
