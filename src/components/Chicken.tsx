import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type Props = React.ComponentProps<typeof Svg>;

const Chicken: React.FC<Props> = (props) => (
  <Svg viewBox="0 0 100 100" {...props}>
    {/* Body */}
    <Path
      d="M 25,75 C -10,90 10,30 50,30 C 90,30 110,90 75,75 C 60,95 40,95 25,75 Z"
      fill="white"
      stroke="black"
      strokeWidth={3}
    />
    {/* Head */}
    <Circle cx={65} cy={25} r={15} fill="white" stroke="black" strokeWidth={3} />
    {/* Comb */}
    <Path
      d="M 60,12 C 60,5 70,5 70,12 C 75,5 80,8 75,15 L 60,15 Z"
      fill="red"
      stroke="black"
      strokeWidth={2}
    />
    {/* Beak */}
    <Path d="M 78,25 L 88,30 L 78,35 Z" fill="orange" stroke="black" strokeWidth={2} />
    {/* Wattle */}
    <Path d="M 75,32 C 75,40 70,40 70,32" fill="red" stroke="black" strokeWidth={2} />
    {/* Eye */}
    <Circle cx={70} cy={23} r={2} fill="black" />
    {/* Wings */}
    <Path d="M 20,60 C 5,50 5,30 25,40" fill="none" stroke="black" strokeWidth={3} />
    <Path d="M 25,65 C 10,55 10,35 30,45" fill="none" stroke="black" strokeWidth={3} />
  </Svg>
);

export default Chicken;
