import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const ReadinessChart = ({ athleteId, tests, readiness }) => {
    if (readiness === 'Unknown' || !readiness) {
        return <p>Not Enough data to sample...</p>;
    }

    const baseline = readiness[0];
    const yAxisDomain = [
        0,
        Math.max(...tests.map(test => test.cmj)) + 10
    ];
    const greenZone = [baseline - readiness[1], yAxisDomain[1]]; // Estendi fino al limite massimo del dominio dell'asse Y
    const yellowZone = [baseline - (2 * readiness[1]), baseline - readiness[1]];
    const redZone = [yAxisDomain[0], baseline - (2 * readiness[1])]; // Inizia dal limite minimo del dominio dell'asse Y

    const yAxisTicks = Array.from({ length: (yAxisDomain[1] / 4) + 1 }, (_, i) => i * 4);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={tests}>
                <CartesianGrid strokeDasharray="10 10" />
                <XAxis dataKey="testDate" />
                <YAxis domain={yAxisDomain} ticks={yAxisTicks} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} payload={[
                    { value: 'Baseline', type: 'line', id: 'baseline', color: 'blue' },
                    { value: 'Green Zone', type: 'rect', id: 'greenZone', color: 'green' },
                    { value: 'Yellow Zone', type: 'rect', id: 'yellowZone', color: '#FBBC05' },
                    { value: 'Red Zone', type: 'rect', id: 'redZone', color: 'red' }
                ]} />
                <ReferenceLine y={baseline} label="Baseline" stroke="blue" strokeDasharray="3 3" />
                <ReferenceArea y1={greenZone[0]} y2={greenZone[1]} fill="green" fillOpacity={0.2} />
                <ReferenceArea y1={yellowZone[0]} y2={yellowZone[1]}  fill="yellow" fillOpacity={0.2} />
                <ReferenceArea y1={redZone[0]} y2={redZone[1]} fill="red" fillOpacity={0.2} />
                <Line type="monotone" dataKey="cmj" stroke="#000" dot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ReadinessChart;


