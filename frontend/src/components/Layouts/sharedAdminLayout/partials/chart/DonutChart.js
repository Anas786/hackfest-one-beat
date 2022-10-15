import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";

function DonutChart({ type, title, percent, options, series }) {
    const { Title, Paragraph } = Typography;
    // const options = { labels: ["Patients", "Admits", "Shifted", "Discharged"] };
    // const series = [10, 5, 3, 2]; //our data

    return (
        <>
          <div className="donut">
            <div>
              <Title level={5}>{title}</Title>
              <Paragraph className="lastweek">
                than last month <span className="bnb2">{percent}</span>
              </Paragraph>
            </div>
          </div>
    
          <ReactApexChart
            options={options}
            series={series}
            type={type}
            height={350}
            width={"100%"}
          />
        </>
      );
}

export default DonutChart;