# CLO4-IDS-ML-Solution

## AI-Powered Network Intrusion Detection System using CIC-IDS2017

**Course:** Information Security | **CLO:** 4 | **Author:** Abdul Rehman

---

## Project Objective

Build and evaluate a Machine Learning-based Network Intrusion Detection System (ML-NIDS) that classifies network traffic flows into **7 categories**:

| Class | Description |
|---|---|
| Normal Traffic | Benign network activity |
| DDoS | Distributed Denial of Service floods |
| DoS | Denial of Service attacks |
| Port Scanning | Network reconnaissance |
| Brute Force | Credential stuffing / password attacks |
| Web Attacks | SQL injection, XSS, Clickjacking |
| Bots | Command-and-control botnet traffic |

---

## Dataset

**CIC-IDS2017** – Canadian Institute for Cybersecurity  
- **2,520,751** labeled network flow records  
- 52 features extracted using CICFlowMeter  
- Covers 5 days of real traffic (benign + attacks)  
- Download: [Kaggle – ericanacletoribeiro/cicids2017-cleaned-and-preprocessed](https://www.kaggle.com/datasets/ericanacletoribeiro/cicids2017-cleaned-and-preprocessed)

---

## Results Summary

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---|---|---|---|
| **Random Forest** | **99.43%** | **99.71%** | **99.43%** | **99.56%** |
| Decision Tree | 99.03% | 99.41% | 99.03% | 99.20% |

---

## Dataset Setup Instructions

1. Download the dataset from Kaggle:
```bash
pip install kaggle
kaggle datasets download -d ericanacletoribeiro/cicids2017-cleaned-and-preprocessed --unzip -p ./dataset
```

2. Ensure the file is at `./dataset/cicids2017_cleaned.csv`

---

## How to Run the Code

### Option 1: Jupyter Notebook (Recommended)
```bash
pip install notebook pandas numpy scikit-learn matplotlib seaborn imbalanced-learn
jupyter notebook IDS_ML_Solution_CIC_IDS2017.ipynb
```

### Option 2: Run pipeline directly
```bash
python3 build_assignment.py
```

---

## Project Structure

```
.
├── dataset/
│   └── cicids2017_cleaned.csv        # Real CIC-IDS2017 data (download separately)
├── IDS_ML_Solution_CIC_IDS2017.ipynb # Main Jupyter Notebook (full pipeline)
├── build_assignment.py               # Standalone pipeline script
├── metrics.json                      # Saved model metrics
├── plot_label_dist.png               # Class distribution
├── plot_correlation.png              # Feature correlation heatmap
├── plot_cm_rf.png                    # Random Forest confusion matrix
├── plot_cm_dt.png                    # Decision Tree confusion matrix
├── plot_feature_importance.png       # Top-15 feature importances
├── plot_model_comparison.png         # Side-by-side model comparison
└── plot_per_class_recall.png         # Per-class recall (security metric)
```

---

## Key Findings

- **DDoS, DoS, Port Scanning** detected with ~100% recall — no critical attacks missed
- **Random Forest** outperforms Decision Tree on all metrics
- **Bots** class shows lower recall (62%) due to class imbalance — future work: LSTM + more data
- **Top features**: Flow Bytes/s, Flow Duration, Fwd IAT Mean, Destination Port

---

## Requirements

```
pandas>=1.5
numpy>=1.23
scikit-learn>=1.1
imbalanced-learn>=0.10
matplotlib>=3.6
seaborn>=0.12
jupyter
```
