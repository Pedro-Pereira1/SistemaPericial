import numpy as np  # linear algebra
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import roc_auc_score, roc_curve, precision_score, recall_score, f1_score, accuracy_score
from fastcore.basics import *
from fastcore.parallel import *
from os import cpu_count
import pandas as pd
import os
import seaborn as sns
import matplotlib.pyplot as plt

def importfile():
    df = pd.read_parquet('data/cic-collection.parquet')
    df = df.drop(columns='Label')
    #print(df.shape)
    #print(df.head)
    feature_info = pd.DataFrame({
        'Feature Name': df.columns,
        'Data Type': df.dtypes
    })

    # Map data types to categories (e.g., text, number)
    feature_info['Type Category'] = feature_info['Data Type'].apply(lambda x: 'Text' if x == 'object' else 'Number')

    # Add your additional column to the table

    # Display the resulting table
    #print(feature_info)
    return df

def graphic_data(df):


    # Create a larger and clearer figure
    plt.figure(figsize=(16, 8))

    # Distribution of the target variable
    sns.countplot(x='ClassLabel', data=df, palette='viridis')

    # Set title and labels
    # plt.title('Distribution of the Target Labels', fontsize=16)
    plt.xlabel('Target Labels', fontsize=20)
    plt.ylabel('Count', fontsize=20)

    # Increase the font size of x-axis tick labels
    plt.xticks(fontsize=20)  # Adjust the font size according to your preference

    plt.savefig('Distribution_target_variables.jpg')
    # Show the plot
    plt.show()

def count(file):
    return file.ClassLabel.value_counts()

if __name__ == '__main__':
    df = importfile()
    print(count(df))

