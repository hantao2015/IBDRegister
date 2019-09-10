import React from "react";
import { Card, Icon, Skeleton, Avatar } from "antd";
const { Meta } = Card;
const CommitCard = (record) => {
  return (
    <div>
      <Card style={{ width: 300, marginTop: 16 }}>
        <Skeleton loading={record.data?false:true}  avatar active>
          <Meta
            avatar={<Icon type="user"></Icon>}
            title={<div>批注人：{record.data.person}</div>}
            description={
              <div>
                <div>时间：{record.data.writeTime}</div>
                <div>建议：{record.data.suggest}</div>
              </div>
            }
          />
        </Skeleton>
      </Card>
    </div>
  );
};
export default CommitCard;
