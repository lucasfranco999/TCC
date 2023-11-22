import { Text } from "react-native-svg";

function Meu({pieCentroid, index, data}){
    return(
      <Text 
      key={`label-${index}`}
      x={pieCentroid[0]-3}
      y={pieCentroid[1]-5}
      fill= "#fff"
      textAnchor={'middle'}
      alignmentBaseline={'middle'}
    >
      R${data.value}
    </Text>
    )
}

export default Meu;