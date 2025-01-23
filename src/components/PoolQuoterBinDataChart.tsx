import {BarChart} from "@mui/x-charts/BarChart";
import {MakeOptional} from "@mui/x-charts/models/helpers";
import {BarSeriesType} from "@mui/x-charts/models/seriesType/bar";

// Props for the component
interface BinDataChartProps {
    xAxisLabels: string[];
    seriesData: MakeOptional<BarSeriesType, 'type'>[];
}

const PoolQuoterBinData = ({xAxisLabels, seriesData }: BinDataChartProps) => {
    return (
        <BarChart
            leftAxis={undefined}
            bottomAxis={undefined}
            sx={{
                //change left yAxis label styles
                "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                    display: 'none'
                },

                // change bottom label styles
                "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                    display: 'none'
                },
                // bottomAxis Line Styles
                "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                    display: 'none'
                },
                // leftAxis Line Styles
                "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                    display: 'none'
                },

                "& .MuiBarElement-root": {
                    width: "2px !important",
                }
            }}
            series={seriesData}
            height={200}
            xAxis={[{ data: xAxisLabels, scaleType: 'band'}]}
            yAxis={[{  sx: {color: 'white'}, stroke: 'none', tickLabelStyle: {color:'white'}, labelStyle: {color:'white'} }]}
            margin={{ top: 0, bottom: 20, left: 0, right: 0 }}
        />
    );
};

export default PoolQuoterBinData;
