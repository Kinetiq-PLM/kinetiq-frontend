import React from 'react';
import "./styles/MRP.css";

const BodyContent = () => {
    
    return (
        <div className="mrp">
            <div style={{width: '100%', height: '100%', paddingLeft: 75, paddingRight: 75, paddingTop: 68, paddingBottom: 30, background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 62, display: 'inline-flex'}}>
                <div style={{alignSelf: 'stretch', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 35, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 1.40, wordWrap: 'break-word'}}>MRP NAVIGATION</div>
                    <div style={{justifyContent: 'center', alignItems: 'center', gap: 80, display: 'flex', flexWrap: 'wrap'}}>
                    <div className='material' style={{width: 441, height: 450, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20, minWidth: 300, maxWidth: '100%'}}>
                        <img className="MRPIcon6" style={{width: '100%', height: '100%', position: 'absolute', opacity: 0.50}} src="/public/icons/module-icons/MRP-icons/MRPIcon6.png"/>
                        <div style={{width: '100%', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center', color: '#585757', fontSize: 'clamp(24px, 5vw, 50px)', fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding: '0 20px'}}>MATERIAL RESOURCE PLANNING</div>
                    </div>
                    <div className='bills' style={{width: 441, height: 450, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20, minWidth: 300, maxWidth: '100%'}}>
                        <img style={{width: '100%', height: '100%', position: 'absolute'}} src="/public/icons/module-icons/MRP-icons/MRPIcon7.png" />
                        <div style={{width: '100%', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center', color: '#585757', fontSize: 'clamp(24px, 5vw, 50px)', fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding: '0 20px'}}>BILLS<br/>OF      MATERIAL</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;