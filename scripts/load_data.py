import os
import pandas as pd

import warnings
warnings.simplefilter("ignore")

BASE_DIR = os.path.dirname(os.getcwd())
DATA_DIR = os.path.join(BASE_DIR, 'data')

def load_GTD(): 
    ''' Load the GTD into a single dataframe. '''
    GTD_path = os.path.join(DATA_DIR, 'GTD.pkl')
    GTD1_path = os.path.join(DATA_DIR, 'GTD1.xlsx')
    GTD2_path = os.path.join(DATA_DIR, 'GTD2.xlsx')

    # If the data is already combined, read it
    if os.path.exists(GTD_path):
        print('GTD pickle file found, loading...')
        GTD = pd.read_pickle(GTD_path)

    # If the data is not combined, combine it
    elif os.path.exists(GTD1_path) and os.path.exists(GTD2_path):
        print('GTD excel files found, combining...')
        # Read data, ignore unicode errors
        GTD_1 = pd.read_excel(GTD1_path)
        GTD_2 = pd.read_excel(GTD2_path)
        # Append the two dataframes and save in a serialized format
        GTD = GTD_1.append(GTD_2)
        GTD.to_pickle(GTD_path)

    # If the data is not found, print an error message
    else:
        print(f'GTD file {GTD_path} not found, please download and put it in data folder.')
        return None
    return GTD


def load_PPTUS(): 
    ''' Load the PPTUS dataset into two dataframes. '''
    # Read PPTUS dataset or create it 
    PPTUS_filepath = os.path.join(DATA_DIR, 'PPT-US_0517dist.xlsx')
    PPTUS_data_path = os.path.join(DATA_DIR, 'PPT-US_DATA.pkl')
    PPTUS_sources_path = os.path.join(DATA_DIR, 'PPT-US_SOURCES.pkl')
    
    if os.path.exists(PPTUS_data_path) and os.path.exists(PPTUS_sources_path): 
        print('PPTUS pickle files found, loading...')
        PPTUS_data = pd.read_pickle(PPTUS_data_path)
        PPTUS_sources = pd.read_pickle(PPTUS_sources_path)
    elif os.path.exists(PPTUS_filepath):
        print('PPTUS excel files found, combining...')
        PPTUS_data = pd.read_excel(PPTUS_filepath, sheet_name='DATA')
        PPTUS_sources = pd.read_excel(PPTUS_filepath, sheet_name='SOURCES')
        PPTUS_data.to_pickle(PPTUS_data_path)
        PPTUS_sources.to_pickle(PPTUS_sources_path)
    else:
        print(f'PPTUS files {PPTUS_data_path}, {PPTUS_sources_path} not found, please download and put it in data/ folder.')
        return None, None
    
    return PPTUS_data, PPTUS_sources

