import React, { Component } from "react";
import "./DownFile.less";
import {
  Collapse,
  Icon,
  Input,
  Upload,
  Button,
  Form,
  message,
  Spin,
  Modal,
  Table
} from "antd";
import http from "../../../utils/api";

const fileId = "621892190597";
const { TextArea } = Input;
const columns = props => {
  const { onDown } = props;
  return [
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
      width: 250
    },
    {
      title: "文件地址",
      dataIndex: "fileUrl",
      key: "fileUrl",
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
        </span>
      )
    }
  ];
};
class DownFile extends Component {
  state = {
    spin: false,
    data: [],
    record: {},
    visible: false,
    fileUrl: ""
  };
  componentDidMount() {
    this.getData();
  }

  //获取文件表记录
  getData = async () => {
    let res;
    this.setState({
      loading: true
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
      loading: false
    });
  };

  handleSubmit = e => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.onSubmit(values);
      }
    });
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
  render() {
    const { spin, data } = this.state;
    return (
      <div className="editNotice">
        <Spin spinning={spin}>
          <Table
            key="3"
            className="editNotice-table"
            columns={columns({
              onDown: record => {
                this.onDown(record.fileUrl);
              },
              data: data
            })}
            scroll={{ x: 1000, y: "calc(100vh - 260px)" }}
            dataSource={data}
          />
        </Spin>
      </div>
    );
  }
}

export default Form.create()(DownFile);
