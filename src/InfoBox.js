import React from 'react';
import { Card,CardContent , Typography} from '@material-ui/core';

import './InfoBox.css'

function InfoBox(props) {
    console.log('infobox', props.active);
    return (
        <Card className={`infobox  ${props.active && 'infobox--selected'} ${props.isRed && 'infobox--red'}`} onClick = {props.onclick}>
            <CardContent>
                <Typography className="infobox__title">{props.title}</Typography>
                <h1 className={`infobox__cases ${!props.isRed && 'infobox__cases--green'}`}>{props.cases}</h1>
                <Typography className="infobox__total">{props.total} Total</Typography>
            </CardContent>

        </Card>
    )
}

export default InfoBox;
