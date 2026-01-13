# Equipment Labeling Document Findings

**Document:** GOO-ISE-GE-RPT-0001-C2_Electrical and I_C Equipment Labelling.pdf

## Equipment Types Covered

This document defines the naming/labeling convention for ALL major equipment and cables. It provides:
- Equipment types
- Quantities
- Naming codes
- Examples

## Solar Farm Equipment

### Power Equipment
- **Power Stations (Skid Solutions):** 1 per block (16 blocks) - Code: BL-x
- **Inverters:** 2 per block (blocks 01-03, 05-16), 1 in block 04 - Code: INV-x.y
  - Total: ~31 inverters
- **LV/MV Transformers:** 1 per block - Code: TRFx
- **LV/LV Auxiliary Transformers:** 1 per block - Code: AUXTRFx
- **RMU (Ring Main Units):** 1 per block - Code: RMU-x
- **Switchgear in RMU:** 3 per RMU - Code: RMU-x/y

### DC Equipment
- **DC Boxes:** Up to 36 per block - Code: varies
- **Strings:** 564 max per Power Block, 9 max per Array - Code: S-v.w.x.y.z
  - v = Block number (1...16)
  - w = Inverter number (1/2)
  - x = DC Box number (1...36)
  - y = Array number (1...5)
  - z = String number (1...9)

### Communications & Monitoring
- **TBox:** Present
- **LoRa Gateway:** Present
- **Combox:** Present
- **Autonomous Weather Station:** Present

### Substation
- **33/66kV Substation:** 1 in the plant - Code: SUB-x
- **33kV Substation Feeders:** 5 feeders - Code: SUBF-x
- **MV/LV Transformer (Auxiliary services):** 1 @ Substation - Code: AUXSUBTRF

### Circuits
- **MV Circuits (PV Plant):** 4 Lines - Code: L-x.y

## Cables Covered
- Low voltage DC cable
- Low voltage AC cable
- Medium voltage cable
- Communication cable (Ethernet and fiber optic)

## Key Insight for Asset Extraction

This document is **CRITICAL** because it defines:
1. **Exact quantities** of each equipment type
2. **Naming conventions** that will appear in other documents
3. **Equipment hierarchy** (blocks → power stations → inverters → DC boxes → strings)

## Asset Count Estimates

Based on this document, Goonumbla should have approximately:
- **16 Power Stations** (1 per block)
- **31 Inverters** (2 per block except block 04)
- **16 LV/MV Transformers**
- **16 LV/LV Auxiliary Transformers**
- **16 RMUs**
- **48 Switchgears** (3 per RMU)
- **~500 DC Boxes** (up to 36 per block × 16 blocks, but likely less)
- **~9,000 Strings** (564 max per block, but actual count TBD)
- **269,000+ PV Modules** (from BOM)
- **1 Main Substation**
- **5 Substation Feeders**
- **1 Weather Station**
- **Multiple Comboxes, TBoxes, LoRa Gateways**

## Next Steps

This document doesn't contain the actual asset instances (e.g., serial numbers, manufacturers), but it tells us:
1. **What to look for** in other documents
2. **How many** of each asset type to expect
3. **How they're named** so we can parse them correctly

We need to find documents that contain the actual equipment specifications, such as:
- Technical specifications for inverters, transformers
- Layout drawings showing actual locations
- Single-line diagrams showing connectivity
- Vendor drawings with specifications
