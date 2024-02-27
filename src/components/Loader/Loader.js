import React from 'react';
import Loader from 'react-loader-spinner';
import {Flex} from "@chakra-ui/react";

export default function index({width, height, color}) {
    return (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
            <Loader
                type="Watch"
                color={color ?? "#50c3a1"}
                width="100%"
                height="100%"
                style={{
                    width: width ?? "min(50%, 250px)",
                    height: height ?? "min(50%, 250px)",
                    padding: "10px"
                }}
            />
        </Flex>
    );
};
